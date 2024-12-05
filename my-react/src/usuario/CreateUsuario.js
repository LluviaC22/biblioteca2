import axios from 'axios';
import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './CreateUsuario.css';
import { useNavigate } from "react-router-dom"; // Ya lo tienes aquí

const URI = 'http://localhost:8000/usuarios';

const CompCreateUsuario = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [idRol, setIdRol] = useState(null); 
    const [showModal, setShowModal] = useState(false); // Estado para controlar el modal
    const [message, setMessage] = useState(''); // Mensaje del modal

    // Usamos useNavigate para obtener la función navigate
    const navigate = useNavigate();

    const store = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token"); 
            await axios.post(
                URI, 
                { 
                    nombre, 
                    email, 
                    contrasena, 
                    id_rol: idRol 
                }, 
                {
                    headers: {
                        "Authorization": `Bearer ${token}`, 
                        "Content-Type": "application/json" 
                    }
                }
            );
            setMessage("Usuario creado con éxito");
            setShowModal(true); // Mostrar el modal de éxito
        } catch (error) {
            console.error("Error al crear el usuario:", error);
            if (error.response) {
                console.log("Código de estado:", error.response.status);
                console.log("Mensaje de error:", error.response.data);
            }
            setMessage("Hubo un error al crear el usuario");
            setShowModal(true); // Mostrar el modal de error
        }
    };

    const handleClose = () => {
        setShowModal(false); // Cerrar el modal
        navigate('/usuarios'); // Redirige a la página de usuarios
    };

    return (
        <div className='container mt-5'>
            <h3>Crear Usuario</h3>
            <form onSubmit={store}>
                <div className='mb-3'>
                    <label className='form-label'>Nombre</label>
                    <input
                        type='text'
                        className='form-control'
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </div>
                <div className='mb-3'>
                    <label className='form-label'>Email</label>
                    <input
                        type='email'
                        className='form-control'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className='mb-3'>
                    <label className='form-label'>Contraseña</label>
                    <input
                        type='password'
                        className='form-control'
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                        required
                    />
                </div>
                <div className='mb-3'>
                    <label className='form-label'>ID de Rol (Opcional)</label>
                    <select
                        className='form-select'
                        value={idRol}
                        onChange={(e) => setIdRol(e.target.value)}
                    >
                        <option value="">Seleccionar rol</option>
                        <option value="1">Administrador</option>
                        <option value="2">Usuario</option>
                    </select>
                </div>
                <button type='submit' className='btn btn-primary'>
                    Crear
                </button>
            </form>

            {/* Modal de confirmación */}
            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{message.startsWith("Error") ? "¡Error!" : "¡Éxito!"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{message}</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        Aceptar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CompCreateUsuario;
