import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap'; // Importar Modal y Button
import './EditUsuario.css';

const URI = 'http://localhost:8000/usuarios';

const CompEditUsuario = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [id_rol, setIdRol] = useState('');
  const { id_usuario } = useParams();
  const navigate = useNavigate();
  
  // Estado para manejar el modal de éxito
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');

  // Procedimiento para actualizar el usuario
  const update = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("No se encontró el token, redirigiendo al login...");
      navigate("/login"); // Redirigir a login si no hay token
      return;
    }

    try {
      await axios.put(`${URI}/${id_usuario}`, {
        nombre: nombre,
        email: email,
        id_rol: id_rol,
      }, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      setMessage("Usuario actualizado con éxito");
      setShowModal(true); // Mostrar el modal de éxito
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      if (error.response) {
        console.log("Código de estado:", error.response.status);
        console.log("Mensaje de error:", error.response.data);
        if (error.response.status === 403) {
          alert("No tienes permisos para editar este usuario.");
        }
      }
      setMessage("Hubo un error al actualizar el usuario");
      setShowModal(true); // Mostrar el modal de error
    }
  };

  // Obtener los datos del usuario por id
  useEffect(() => {
    const getUsuarioById = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login"); 
        return;
      }

      try {
        const res = await axios.get(`${URI}/${id_usuario}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        setNombre(res.data.nombre);
        setEmail(res.data.email);
        setIdRol(res.data.id_rol);
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
        if (error.response && error.response.status === 403) {
          alert("No tienes permisos para ver este usuario.");
          navigate("/usuarios"); // Redirigir a usuarios si no se tiene acceso
        }
      }
    };

    getUsuarioById();
  }, [id_usuario, navigate]);

  const handleCloseModal = () => {
    setShowModal(false);
    if (message === "Usuario actualizado con éxito") {
      navigate('/usuarios'); // Redirigir a la lista de usuarios si la actualización fue exitosa
    }
  };

  return (
    <div className="cont-usuario">
      <h1 className="titulo">Editar usuario</h1>
      <form onSubmit={update}>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            type="text"
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Rol</label>
          <select
            value={id_rol}
            onChange={(e) => setIdRol(e.target.value)}
            className="form-control"
          >
            <option value="">Selecciona un rol</option>
            <option value="1">Admin</option>
            <option value="2">Usuario</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Actualizar</button>
      </form>

      {/* Modal de confirmación */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{message.startsWith("Error") ? "¡Error!" : "¡Éxito!"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CompEditUsuario;
