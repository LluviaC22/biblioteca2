import axios from 'axios';
import './EditLibro.css';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

const URI = 'http://localhost:8000/libros';

const CompEditLibro = () => {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [categoria, setCategoria] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [disponible, setDisponible] = useState(true);
  const [showModal, setShowModal] = useState(false); // Control del modal
  const { id_libro } = useParams();
  const navigate = useNavigate();

  // Procedimiento para actualizar
  const update = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `${URI}/${id_libro}`,
        {
          titulo: titulo,
          autor: autor,
          isbn: isbn,
          categoria: categoria,
          cantidad: cantidad,
          disponible: disponible,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowModal(true); // Mostrar el modal después de editar
    } catch (error) {
      console.error('Error al actualizar el libro:', error);
      if (error.response) {
        console.log('Código de estado:', error.response.status);
        console.log('Mensaje de error:', error.response.data);
      }
    }
  };

  const handleClose = () => {
    setShowModal(false);
    navigate('/libros'); // Redirigir después de cerrar el modal
  };

  useEffect(() => {
    getLibroById_libro();
  }, []);

  const getLibroById_libro = async () => {
    const res = await axios.get(`${URI}/${id_libro}`);
    setTitulo(res.data.titulo);
    setAutor(res.data.autor);
    setIsbn(res.data.isbn);
    setCategoria(res.data.categoria);
    setCantidad(res.data.cantidad);
    setDisponible(res.data.disponible);
  };

  return (
    <div className="container">
      <h1 className="title">Editar libro</h1>
      <form onSubmit={update}>
        <div className="form-grid">
          <div className="mb-3">
            <label className="form-label">Título</label>
            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              type="text"
              className="form-input"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Autor</label>
            <input
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
              type="text"
              className="form-input"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">ISBN</label>
            <input
              value={isbn}
              onChange={(e) => setIsbn(Number(e.target.value))}
              type="number"
              className="form-input"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Categoría</label>
            <input
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              type="text"
              className="form-input"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Cantidad</label>
            <input
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
              type="number"
              className="form-input"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Disponible</label>
            <input
              type="checkbox"
              checked={disponible}
              onChange={() => setDisponible(!disponible)}
            />
          </div>
        </div>
        <button type="submit" className="submit-button">
          Actualizar
        </button>
      </form>

      {/* Modal de confirmación */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>¡Libro Actualizado!</Modal.Title>
        </Modal.Header>
        <Modal.Body>El libro ha sido editado correctamente.</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CompEditLibro;
