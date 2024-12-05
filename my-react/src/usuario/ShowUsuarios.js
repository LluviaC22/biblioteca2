import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import './ShowUsuarios.css';

const URI = 'http://localhost:8000/usuarios';

const CompShowUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [showModal, setShowModal] = useState(false); // Estado para el modal
    const [message, setMessage] = useState(''); // Mensaje del modal
    const [usuarioToDelete, setUsuarioToDelete] = useState(null); // ID del usuario a eliminar

    useEffect(() => {
        getUsuarios();
    }, []);

    const getUsuarios = async () => {
        try {
            const res = await axios.get(URI, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            setUsuarios(res.data);
        } catch (error) {
            console.error("Error al obtener los usuarios:", error);
            if (error.response) {
                console.log("Código de estado:", error.response.status);
                console.log("Mensaje de error:", error.response.data);
                if (error.response.status === 403) {
                    alert("No tienes permiso para acceder a esta página.");
                }
            } else {
                console.error("Error de solicitud:", error.message);
            }
        }
    };

    const deleteUsuario = async (id_usuario) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${URI}/${id_usuario}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setMessage('Usuario eliminado con éxito');
            setShowModal(true); // Mostrar modal de éxito
            getUsuarios(); // Actualizar la lista de usuarios
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
            if (error.response) {
                console.log('Código de estado:', error.response.status);
                console.log('Mensaje de error:', error.response.data);
            }
            setMessage('Hubo un error al eliminar el usuario');
            setShowModal(true); // Mostrar modal de error
        }
    };

    const handleClose = () => {
        setShowModal(false);  // Cerrar el modal
    };

    return (
        <div className="vista-usuarios-container">
            <div className="row">
                <div className="col">
                    <Link 
                        to="/create-usuario" 
                        className="btn-crear-usuario mb-3"
                    >
                        Crear Usuario
                    </Link>

                    <div className="table-responsive">
                        <table className="table-usuarios">
                            <thead className="text-center">
                                <tr>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map((usuario) => (
                                    <tr key={usuario.id_usuario}>
                                        <td>{usuario.nombre}</td>
                                        <td>{usuario.email}</td>
                                        <td className="text-center">
                                            <div className="boton-group" role="group">
                                                <Link 
                                                    to={`/edit-usuario/${usuario.id_usuario}`} 
                                                    className="boton-editar"
                                                >
                                                    Editar
                                                </Link>
                                                <button 
                                                    onClick={() => deleteUsuario(usuario.id_usuario)} 
                                                    className="boton-eliminar"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal de confirmación */}
            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{message.startsWith('Error') ? '¡Error!' : '¡Éxito!'}</Modal.Title>
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

export default CompShowUsuarios;
