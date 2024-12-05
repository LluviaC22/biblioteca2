import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import './ShowLibros.css';

const URI = 'http://localhost:8000/libros';

const CompShowLibros = () => {
    const [libros, setLibro] = useState([]);
    const [showModal, setShowModal] = useState(false); // Estado para el modal
    const [message, setMessage] = useState(''); // Mensaje del modal
    const [bookToDelete, setBookToDelete] = useState(null); // ID del libro a eliminar

    useEffect(() => {
        getLibros();
    }, []);

    const getLibros = async () => {
        const res = await axios.get(URI);
        setLibro(res.data);
    };

    const deleteLibro = async (id_libro) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${URI}/${id_libro}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setMessage('Libro eliminado con éxito');
            setShowModal(true);  // Mostrar modal de éxito
            getLibros(); // Actualizar la lista de libros
        } catch (error) {
            console.error('Error al eliminar el libro:', error);
            if (error.response) {
                console.log('Código de estado:', error.response.status);
                console.log('Mensaje de error:', error.response.data);
            }
            setMessage('Hubo un error al eliminar el libro');
            setShowModal(true);  // Mostrar modal de error
        }
    };

    const handleClose = () => {
        setShowModal(false);  // Cerrar el modal
    };

    return (
        <div className="vista-libros-container">
            <h2>Gestión de Libros</h2>
            <div className="row">
                <div className="col">
                    <Link to="/create" className="btn-crear-libro mb-3">
                        Crear Libro
                    </Link>

                    {/* Contenedor para hacer la tabla responsiva */}
                    <div className="table-responsive">
                        <table className="table-libros">
                            <thead className="text-center">
                                <tr>
                                    <th>Título</th>
                                    <th>Autor</th>
                                    <th>ISBN</th>
                                    <th>Categoría</th>
                                    <th>Cantidad</th>
                                    <th>Disponible</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {libros.map((libro) => (
                                    <tr key={libro.id_libro}>
                                        <td>{libro.titulo}</td>
                                        <td>{libro.autor}</td>
                                        <td>{libro.isbn}</td>
                                        <td>{libro.categoria}</td>
                                        <td>{libro.cantidad}</td>
                                        <td>{libro.disponible ? 'Sí' : 'No'}</td>
                                        <td className="text-center">
                                            <div className="btn-group" role="group">
                                                <Link
                                                    to={`/edit/${libro.id_libro}`}
                                                    className="editar-btn "
                                                >
                                                    Editar
                                                </Link>
                                                <button
                                                    onClick={() => deleteLibro(libro.id_libro)}
                                                    className="eliminar-btn"
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
                    {/* Fin del contenedor responsivo */}
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

export default CompShowLibros;
