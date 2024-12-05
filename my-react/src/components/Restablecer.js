import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import './Restablecer.css';

const Restablecer = () => {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/usuarios/restablecer', { email });
      setMensaje(response.data.message);
      setIsSuccess(true);
      setModalVisible(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al enviar el correo');
      setIsSuccess(false);
      setModalVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <div className="cont-restablecer">
      <h2 className="text-center">Restablecer Contraseña</h2>

      {/* Texto informativo */}
      <p className="text-center mb-4">
        Para restablecer tu contraseña, ingresa tu correo electrónico. Si podemos encontrarlo en la base de datos,
        te enviaremos un email con instrucciones para poder acceder de nuevo.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="email" className="form-label">Correo Electrónico:</label>
          <input
            type="email"
            id="email"
            className="form-control"
            placeholder="Ingrese su correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="btn w-100"
          disabled={isLoading}
        >
          {isLoading ? 'Enviando...' : 'Enviar Correo'}
        </button>
      </form>

      {/* Modal de React-Bootstrap */}
      <Modal show={modalVisible} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isSuccess ? 'Éxito' : 'Error'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{isSuccess ? mensaje : error}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant={isSuccess ? 'success' : 'danger'} onClick={closeModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Restablecer;
