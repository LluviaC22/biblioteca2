import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import './ConfiguracionPerfil.css';

const ActualizarPerfil = ({ id_usuario }) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState(''); // Para la nueva contraseña si se ingresa
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token'); // Recupera el token del localStorage
    if (!token) {
      setError('Token no disponible. Inicia sesión primero.');
      setIsSuccess(false);
      setModalVisible(true);
      return;
    }

    try {
      const dataToUpdate = {};

      // Solo se agregan los campos que el usuario ha modificado
      if (nombre) dataToUpdate.nombre = nombre;
      if (email) dataToUpdate.email = email;
      if (contrasena) dataToUpdate.contrasena = contrasena;

      const response = await axios.put(
        `http://localhost:8000/usuarios/actualizar/${id_usuario}`,
        dataToUpdate,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMensaje(response.data.message);
      setIsSuccess(true);
      setModalVisible(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar el perfil');
      setIsSuccess(false);
      setModalVisible(true);
    }
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <div className="configuracion-perfil-container">
      <div className="perfil-card">
        <h2>Actualizar Perfil</h2>

        <form onSubmit={handleSubmit} className="perfil-formulario">
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Escribe tu nombre"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Escribe tu correo electrónico"
            />
          </div>

          <div className="form-group">
            <label>Contraseña (opcional)</label>
            <input
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="Escribe tu nueva contraseña"
            />
          </div>

          <button type="submit" className="btn-guardar">
            Actualizar
          </button>
        </form>
      </div>

      {/* Modal para mensajes */}
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

export default ActualizarPerfil;
