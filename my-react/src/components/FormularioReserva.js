import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import './FormularioReserva.css'

const CompReservaForm = () => {
  const { id_libro } = useParams();
  const [formData, setFormData] = useState({
    titulo: '',
    id_libro: id_libro || '',
    id_usuario: '',
    nombres: '',
    ap_paterno: '',
    ap_materno: '',
    fecha_reserva: '',
    estado: 'activo',
  });

  const [reservationSuccess, setReservationSuccess] = useState(false);
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
      const response = await axios.post('http://localhost:8000/libros/reservar', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setModalMessage(response.data.message);
      setReservationSuccess(true);
      setShowModal(true);
    } catch (error) {
      setModalMessage(error.response?.data.message || 'Error al reservar el libro');
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
        'http://localhost:8000/libros/generar-pdf-reserva',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob',
        }
      );

      if (response.status === 200) {
        const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
        const pdfUrl = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = `reserva_${formData.id_usuario}.pdf`;
        link.click();
        window.URL.revokeObjectURL(pdfUrl);
      } else {
        console.error('Error al generar el PDF: Respuesta inesperada', response);
        alert('Error al generar el PDF. Intente nuevamente.');
      }
    } catch (error) {
      console.error('Error al generar el PDF:', error.response || error);
      alert('Error al generar el PDF. Por favor, verifique la consola para más detalles.');
    }
  };

  return (
    <div className="form-reserva">
      <h2>Formulario de Reserva</h2>
      <form onSubmit={handleSubmit}>
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
          Fecha de Reserva
          <input
            type="date"
            name="fecha_reserva"
            value={formData.fecha_reserva}
            onChange={handleInputChange}
            required
          />
        </label>
        <button type="submit">Reservar</button>
      </form>

      {/* Modal*/}
      <Modal show={showModal} onHide={() => setShowModal(false)}className="modal-reserva">
        <Modal.Header closeButton className="modal-r-header">
          <Modal.Title className="modal-r-titulo">Resultado de la Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-r-body">
          <p>{modalMessage}</p>
          {reservationSuccess && (
            <Button variant="primary" className="modal-r-boton" onClick={handleGeneratePDF}>
              Generar PDF
            </Button>
          )}
        </Modal.Body>
        <Modal.Footer  className="modal-r-footer">
          <Button variant="secondary" className="modal-r-boton-cerrar" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CompReservaForm;
