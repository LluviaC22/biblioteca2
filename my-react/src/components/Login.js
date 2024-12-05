import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import './Login.css'; 
import logo from './assets/logo.jpeg'; 

const Login = () => {
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

    try {
      const response = await axios.post('http://localhost:8000/usuarios/login', {
        email,
        contrasena,
      });

      // Almacenar datos del usuario y token en el localStorage
      const { token, usuario } = response.data;
      localStorage.setItem('token', token); 
      localStorage.setItem('nombre', usuario.nombre); 
      localStorage.setItem('isAdmin', usuario.email === 'admin@gmail.com'); // Verifica si es admin

      // Redirigir a la página principal sin mostrar mensaje de éxito
      navigate('/inicio', { state: { message: '¡Inicio de sesión exitoso!' } });
    } catch (err) {
      // Mostrar mensaje de error en el modal
      setError(err.response?.data?.message || 'Error al iniciar sesión');
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2 className="Titulo">Biblioteca Pública<br />Mario Hugo Marino Ortiz</h2>
        <img src={logo} alt="Logo" className="logo-image" /> 
        <form onSubmit={handleSubmit} className="login-form">
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
          <button type="submit" className="Loginboton" disabled={isLoading}>
            {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>
        <p className="Link-contraseña">
          ¿Olvidaste tu contraseña? <Link to="/restablecer">Haz clic aquí</Link>
        </p>
        <p className="Link-registro">
          ¿No tienes una cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>
      </div>

      {/* Modal para mostrar mensajes de error */}
      <Modal show={showModal} onHide={cerrarModal}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="error-message">
            {error}
          </p>
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

export default Login;
