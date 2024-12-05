import axios from "axios";
import { useState } from "react";
import { Modal, Button } from "react-bootstrap"; 
import { useNavigate } from "react-router-dom";
import './CreateLibro.css';

const URI = 'http://localhost:8000/libros';

const CompCreateLibro = () => {
    const [titulo, setTitulo] = useState('');
    const [autor, setAutor] = useState('');
    const [isbn, setIsbn] = useState('');
    const [categoria, setCategoria] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [disponible, setDisponible] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal
    const navigate = useNavigate();

    // Procedimiento guardar
    const store = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token"); 
        if (!titulo || !autor || !isbn || !categoria || !cantidad) {
            setError("Por favor, complete todos los campos.");
            return;
        }
        setError(''); // Limpiar mensaje de error
        try {
            await axios.post(URI, 
                {
                    titulo: titulo,
                    autor: autor,
                    isbn: isbn,
                    categoria: categoria,
                    cantidad: cantidad,
                    disponible: disponible
                },
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            setShowModal(true); // Mostrar el modal en caso de éxito
        } catch (error) {
            if (error.response) {
                console.error("Error de la solicitud:", error.response);
                setError("Error al guardar el libro, intente nuevamente.");
            } else if (error.request) {
                console.error("No se recibió respuesta del servidor");
                setError("No se recibió respuesta del servidor.");
            } else {
                console.error("Error en la configuración de la solicitud");
                setError("Error en la configuración de la solicitud.");
            }
        }
    };

    // Función para cerrar el modal y redirigir
    const handleCloseModal = () => {
        setShowModal(false);
        navigate('/libros'); // Redirigir después de cerrar el modal
    };

    return (
        <div className="cont-create">
            <h1 className="titulo-crear">Crear Libro</h1>
            {error && <div className="alert alert-danger">{error}</div>} {/* Mostrar error si existe */}
            <form onSubmit={store}>
                <div className="row">
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="form-label">Título</label>
                            <input 
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)} 
                                type="text"
                                className="form-control"
                                placeholder="Ingrese el título del libro"
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="form-label">Autor</label>
                            <input 
                                value={autor}
                                onChange={(e) => setAutor(e.target.value)} 
                                type="text"
                                className="form-control"
                                placeholder="Ingrese el autor del libro"
                            />
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="form-label">ISBN</label>
                            <input 
                                value={isbn}
                                onChange={(e) => setIsbn(e.target.value)} 
                                type="text"
                                className="form-control"
                                placeholder="Ingrese el ISBN"
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="form-label">Categoría</label>
                            <input 
                                value={categoria}
                                onChange={(e) => setCategoria(e.target.value)} 
                                type="text"
                                className="form-control"
                                placeholder="Ingrese la categoría del libro"
                            />
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="form-label">Cantidad</label>
                            <input 
                                value={cantidad}
                                onChange={(e) => setCantidad(e.target.value)} 
                                type="number"
                                className="form-control"
                                placeholder="Cantidad disponible"
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="form-label">Disponible</label>
                            <input
                                type="checkbox"
                                checked={disponible}
                                onChange={() => setDisponible(!disponible)}
                            />
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <button type="submit" className="btn-guardar">Guardar</button>
                </div>
            </form>

            {/* Modal */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Libro creado</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¡El libro ha sido creado exitosamente!
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleCloseModal}>
                        Aceptar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CompCreateLibro;
