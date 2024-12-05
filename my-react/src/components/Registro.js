import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import './Registro.css';
import logo from './assets/logo.jpeg';

const Registro = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const cerrarModal = () => {
    setShowModal(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validación
    const validatePassword = (password) => {
      const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return regex.test(password);
    };
    
    if (!nombre.trim()) {
      setError('El nombre es obligatorio.');
      setShowModal(true);
      setIsLoading(false);
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('El correo electrónico no es válido.');
      setShowModal(true);
      setIsLoading(false);
      return;
    }

    if (!validatePassword(contrasena)) {
      setError(
        'La contraseña debe tener al menos 8 caracteres, incluir una letra, un número y un carácter especial.'
      );
      setShowModal(true);
      setIsLoading(false);
      return;
    }

    try {
      const id_rol = email === 'admin@gmail.com' ? 1 : 2;
      await axios.post('http://localhost:8000/usuarios/register', { 
        nombre, 
        email, 
        contrasena,
        id_rol
      });
      localStorage.setItem('nombre', nombre);
      // Redirigir a la página de inicio después del registro exitoso
      navigate('/inicio', { state: { message: 'Registro exitoso. Bienvenido!' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar usuario');
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2 className="Titulo">Registro de Usuario</h2>
        <img src={logo} alt="Logo Biblioteca" className="logo-image" />
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre:</label>
            <input
              type="text"
              id="nombre"
              placeholder="Ingrese su nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico:</label>
            <input
              type="email"
              id="email"
              placeholder="Ingrese su correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="contrasena">Contraseña:</label>
            <input
              type="password"
              id="contrasena"
              placeholder="Ingrese su contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="Registro-boton" disabled={isLoading}>
            {isLoading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
        <p className="Link-loguin">
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </div>

      {/* Modal para mostrar errores */}
      <Modal show={showModal} onHide={cerrarModal}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="error-message">{error}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Registro;
