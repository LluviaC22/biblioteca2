//Importaciones
import express from 'express'
import { verifyToken } from '../middlewares/auth.js';
import { verifyRole } from '../middlewares/VerificarRol.js';
import { obtenerHistorial, cambiarEstadoReserva, devolverLibro} from '../controllers/HistorialController.js';
import {getAllLibros, getLibro, createLibro, updateLibro, deleteLibro, buscarLibro, reservarLibro, prestarLibro} from '../controllers/LibroController.js'
import { generarPdfReserva } from '../Pdfkit/GenerarPdf.js';
import { generarPdfPrestamo } from '../Pdfkit/GenerarPdf.js';

const router = express.Router()//router 

// Rutas públicas
router.get('/', getAllLibros)
router.get('/:id_libro', getLibro)
router.get('/buscar/:termino', buscarLibro);

// Rutas protegidas
//Se requiere que el usuario sea id_rol:1, que es administrador
router.post('/',verifyToken, verifyRole([1]),createLibro)
router.put('/:id_libro',verifyToken, verifyRole([1]), updateLibro)
router.delete('/:id_libro',verifyToken, verifyRole([1]), deleteLibro)

// Rutas para reservas y préstamos, requieren autenticación
//Cualquier usuario que esté logueado puede reservar o predir prestado un libro
router.post('/reservar', verifyToken, reservarLibro);
router.post('/prestar', verifyToken, prestarLibro);
router.get('/historial/:id_usuario', verifyToken,obtenerHistorial);
router.put('/reservas/:id_reserva', verifyToken, cambiarEstadoReserva);
router.put('/prestamos/:id_prestamo', verifyToken, devolverLibro);
router.post('/generar-pdf-reserva', verifyToken, generarPdfReserva);
router.post('/generar-pdf-prestamo', verifyToken, generarPdfPrestamo);

export default router;