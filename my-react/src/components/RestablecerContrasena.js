import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

const RestablecerContrasena = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Verificar el token al cargar el componente
  useEffect(() => {
    const verificarToken = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/usuarios/restablecer-contrasena/${token}`);
        if (response.data.isValid) {
          setIsTokenValid(true);
        }
      } catch (error) {
        setModalMessage('El token no es válido o ha expirado');
        setModalVisible(true);
      }
    };

    verificarToken();
  }, [token]);

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (nuevaContrasena !== confirmarContrasena) {
      setModalMessage('Las contraseñas no coinciden');
      setModalVisible(true);
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8000/usuarios/restablecer/${token}`,
        { nuevaContrasena }
      );
      setModalMessage(response.data.message);
      setIsSuccess(true);
      setModalVisible(true);
    } catch (error) {
      setModalMessage(error.response?.data?.message || 'Error al actualizar la contraseña');
      setModalVisible(true);
    }
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setModalVisible(false);
    if (isSuccess) {
      navigate('/login'); // Redirige al login después del éxito
    }
  };

  // Si el token no es válido, mostrar un mensaje
  if (!isTokenValid && !modalVisible) {
    return <div className="text-center mt-10 text-danger">Verificando token...</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Restablecer Contraseña</h2>
      <p>
        Ingresa tu nueva contraseña y confírmala para poder restablecer tu acceso. Asegúrate de que ambas contraseñas coincidan.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nuevaContrasena" className="form-label">Nueva Contraseña</label>
          <input
            type="password"
            id="nuevaContrasena"
            value={nuevaContrasena}
            onChange={(e) => setNuevaContrasena(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="confirmarContrasena" className="form-label">Confirmar Contraseña</label>
          <input
            type="password"
            id="confirmarContrasena"
            value={confirmarContrasena}
            onChange={(e) => setConfirmarContrasena(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Restablecer Contraseña</button>
      </form>

      {/* Modal de React-Bootstrap */}
      <Modal show={modalVisible} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isSuccess ? 'Éxito' : 'Error'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{modalMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant={isSuccess ? 'success' : 'danger'} onClick={closeModal}>
            {isSuccess ? 'Ir al Login' : 'Cerrar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RestablecerContrasena;
