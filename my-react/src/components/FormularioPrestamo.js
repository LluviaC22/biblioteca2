import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './FormularioPrestamo.css';
import { Modal, Button } from 'react-bootstrap';


const CompPrestamoForm = () => {
  const { id_libro } = useParams();
  const [formData, setFormData] = useState({
    titulo: '', 
    id_libro: id_libro || '',
    id_usuario: '',
    nombres: '',
    ap_paterno: '',
    ap_materno: '',
    domicilio: '',  
    fecha_prestamo: '',
    fecha_devolucion: '',
    estado: 'activo',
  });

  const [prestamoSuccess, setPrestamoSuccess] = useState(false); // Estado para éxito del préstamo
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }

    // Cargar el título del libro utilizando el ID del libro
    const fetchBookTitle = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/libros/${id_libro}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFormData((prev) => ({
          ...prev,
          titulo: response.data.titulo || '', // Asignar el título al estado
        }));
      } catch (error) {
        console.error('Error al cargar el título del libro:', error);
      }
    };

    fetchBookTitle();
  }, [id_libro, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      const response = await axios.post('http://localhost:8000/libros/prestar', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setModalMessage(response.data.message);
      setPrestamoSuccess(true);
      setShowModal(true);
    } catch (error) {
      setModalMessage(error.response?.data.message || 'Error al pedir el libro');
      setShowModal(true);
    }
  };

  const handleGeneratePDF = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Token de autorización no encontrado. Por favor, inicie sesión nuevamente.');
        return;
      }

      const response = await axios.post(
        'http://localhost:8000/libros/generar-pdf-prestamo',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob', // Para recibir el archivo PDF en formato blob
        }
      );

      if (response.status === 200) {
        const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
        const pdfUrl = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = `prestamo_${formData.id_usuario}.pdf`;
        link.click();
        window.URL.revokeObjectURL(pdfUrl);
      } else {
        console.error('Error al generar el PDF: Respuesta inesperada', response);
        alert('Error al generar el PDF. Intente nuevamente.');
      }
    } catch (error) {
      console.error('Error al generar el PDF:', error.response?.data || error);
      alert(error.response?.data?.message || 'Error al generar el PDF. Por favor, verifique la consola para más detalles.');
    }
  };

  return (
    <div className="form-prestamo">
      <h2>Formulario de Préstamo</h2>
      <form onSubmit={handleSubmit}>
        {/* Campo de Título, que ahora se incluye en el formulario */}
        <label>
          Título del Libro
          <input type="text" name="titulo" value={formData.titulo} readOnly />
        </label>
        <label>
          Nombre(s)
          <input
            type="text"
            name="nombres"
            value={formData.nombres}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Apellido Paterno
          <input
            type="text"
            name="ap_paterno"
            value={formData.ap_paterno}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Apellido Materno
          <input
            type="text"
            name="ap_materno"
            value={formData.ap_materno}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Domicilio
          <input
            type="text"
            name="domicilio"
            value={formData.domicilio}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Fecha de Préstamo
          <input
            type="date"
            name="fecha_prestamo"
            value={formData.fecha_prestamo}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Fecha de Devolución
          <input
            type="date"
            name="fecha_devolucion"
            value={formData.fecha_devolucion}
            onChange={handleInputChange}
            required
          />
        </label>
        <button type="submit">Pedir prestado</button>
      </form>


       {/* Modal de Bootstrap */}
       <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Resultado de la Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{modalMessage}</p>
          {prestamoSuccess && (
            <Button variant="primary" onClick={handleGeneratePDF}>
              Generar PDF
            </Button>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CompPrestamoForm;
