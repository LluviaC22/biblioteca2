import PDFDocument from 'pdfkit';//Lib para generar pdfs
import fs from 'fs';//Para la manipulación de archivos
import fsPromises from 'fs/promises';//Método más reciente que incluye async, await
import path from 'path';//Maneja rutas de archivos y directorios
import { fileURLToPath } from 'url';//Convierte la URL del archivo actual a una ruta del sistema de archivos

const __filename = fileURLToPath(import.meta.url);//Ruta del archivo actual
const __dirname = path.dirname(__filename);//Ruta del directorio actual

// GENERAR PDF RESERVA
export const generarPdfReserva = async (req, res) => {
  try {
    const { id_usuario, titulo, nombres, ap_paterno, ap_materno, fecha_reserva } = req.body;
    //Define la ruta donde se guardará el pdf
    const pdfDir = path.join(__dirname, '..', 'Pdfkit');
    await fsPromises.mkdir(pdfDir, { recursive: true });//crear directorio si no existe

    const filePath = path.join(pdfDir, `GenerarPdf_${id_usuario}_${Date.now()}.pdf`);//Genera nombre para el pdf


    const doc = new PDFDocument();//Crea dos pdf
    const writeStream = fs.createWriteStream(filePath);
    
    doc.pipe(writeStream);

    // Título del PDF
    doc.fontSize(20).font('Helvetica-Bold').text('Ficha de Reserva', { align: 'center' });
    doc.moveDown(1); // Espacio entre el título y el contenido

    // Información de la reserva
    doc.fontSize(12).font('Helvetica-Bold').text('Detalles de la Reserva');
    doc.moveDown(0.5);  // Espacio entre el título y los detalles

    // Texto de los detalles de la reserva
    doc.text(`Título del libro: ${titulo}`, { lineGap: 5 });
    doc.text(`Nombre: ${nombres} ${ap_paterno} ${ap_materno}`, { lineGap: 5 });
    doc.text(`Fecha de Reserva: ${fecha_reserva}`, { lineGap: 5 });

    // Estilo adicional (mensaje de agradecimiento)
    doc.moveDown(2); // Espacio extra antes de la línea final
    doc.fontSize(12).font('Helvetica').text('Gracias por tu reserva', { align: 'center' });

    // Crear borde decorativo
    doc.rect(50, 50, 500, 700)  // Trazar un borde alrededor de todo el contenido
      .lineWidth(1)
      .strokeColor('#000')
      .stroke();

    doc.end();

    //Espera a que el archivo se escriba en el disco
    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    //Enviar archivo al cliente
    res.type('pdf');
    res.download(filePath, `Ficha_reserva${id_usuario}.pdf`, async (err) => {
      try {
        if (err) {
          console.error('Error al enviar el archivo:', err);
          return res.status(500).json({ message: 'Error al enviar el archivo' });
        }
        await fsPromises.unlink(filePath); // Elimina el archivo después de enviarlo
      } catch (unlinkError) {
        console.error('Error al eliminar el archivo:', unlinkError);
      }
    });
  } catch (error) {
    console.error('Error general:', error);
    res.status(500).json({ message: 'Error al generar el PDF' });
  }
};

// GENERAR PDF PRÉSTAMO
export const generarPdfPrestamo = async (req, res) => {
  try {
    const { id_usuario, titulo, nombres, ap_paterno, ap_materno, fecha_prestamo, fecha_devolucion } = req.body;

    const pdfDir = path.join(__dirname, '..', 'Pdfkit');
    await fsPromises.mkdir(pdfDir, { recursive: true });

    const filePath = path.join(pdfDir, `GenerarPdf_${id_usuario}_${Date.now()}.pdf`);

    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(filePath);
    
    doc.pipe(writeStream);

    doc.fontSize(18).text('Ficha de Préstamo', { align: 'center' });
    doc.moveDown();
    doc.text(`Tiulo del libro: ${titulo}`);
    doc.text(`Nombre: ${nombres} ${ap_paterno} ${ap_materno}`);
    doc.text(`Fecha de Préstamo: ${fecha_prestamo}`);
    doc.text(`Fecha de Devolución: ${fecha_devolucion}`);

    doc.end();

    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    // Establecer el tipo de contenido como PDF y luego descargarlo
    res.type('pdf');
    res.download(filePath, `Ficha_prestamo${id_usuario}.pdf`, async (err) => {
      try {
        if (err) {
          console.error('Error al enviar el archivo:', err);
          return res.status(500).json({ message: 'Error al enviar el archivo' });
        }
        await fsPromises.unlink(filePath); // Elimina el archivo después de enviarlo
      } catch (unlinkError) {
        console.error('Error al eliminar el archivo:', unlinkError);
      }
    });
  } catch (error) {
    console.error('Error general:', error);
    res.status(500).json({ message: 'Error al generar el PDF' });
  }
};
