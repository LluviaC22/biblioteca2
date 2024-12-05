import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import "./Historial.css";

const Historial = ({ id_usuario }) => {
  const [historial, setHistorial] = useState(null);
  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const cerrarModal = () => {
    setShowModal(false);
    setError(null);
    setMensajeExito(null);
  };

  const abrirModal = (mensaje) => {
    setMensajeExito(mensaje);
    setShowModal(true);
  };

  const cambiarEstadoReserva = async (id_reserva, nuevoEstado) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/libros/reservas/${id_reserva}`,
        { estado: nuevoEstado, id_usuario },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setHistorial((prevHistorial) => {
        const reservasActualizadas = prevHistorial.reservas.map((reserva) =>
          reserva.id_reserva === id_reserva
            ? { ...reserva, estado: nuevoEstado }
            : reserva
        );
        return { ...prevHistorial, reservas: reservasActualizadas };
      });

      abrirModal("Estado de la reserva actualizado con éxito.");
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
      setShowModal(true);
    }
  };

  const devolverLibro = async (id_prestamo) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/libros/prestamos/${id_prestamo}`,
        { devuelto: true },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setHistorial((prevHistorial) => {
        const prestamosActualizados = prevHistorial.prestamos.map((prestamo) =>
          prestamo.id_prestamo === id_prestamo
            ? { ...prestamo, devuelto: true, fecha_devolucion: new Date().toLocaleDateString() }
            : prestamo
        );
        return { ...prevHistorial, prestamos: prestamosActualizados };
      });

      abrirModal("Libro marcado como devuelto con éxito.");
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
      setShowModal(true);
    }
  };

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/libros/historial/${id_usuario}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setHistorial(response.data);
      } catch (error) {
        setError(error.response ? error.response.data.message : error.message);
        setShowModal(true);
      }
    };

    fetchHistorial();
  }, [id_usuario]);

  if (!historial) {
    return <p className="historial-loading">Cargando historial...</p>;
  }

  return (
    <div className="historial-container">
      <h2 className="historial-title">HISTORIAL</h2>

      <Modal show={showModal} onHide={cerrarModal}>
        <Modal.Header closeButton>
          <Modal.Title>{error ? "Error" : "Éxito"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{error || mensajeExito}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {historial.reservas.length > 0 ? (
        <>
          <h3 className="historial-subtitle">Reservas</h3>
          <table className="historial-table">
            <thead>
              <tr>
                <th>Libro</th>
                <th>Autor</th>
                <th>Fecha Reserva</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {historial.reservas.map((reserva, index) => (
                <tr key={index}>
                  <td>{reserva.libro.titulo}</td>
                  <td>{reserva.libro.autor}</td>
                  <td>{reserva.fecha_reserva}</td>
                  <td>
                    <select
                      className="historial-select"
                      value={reserva.estado}
                      onChange={(e) => cambiarEstadoReserva(reserva.id_reserva, e.target.value)}
                    >
                      <option value="activo">Activo</option>
                      <option value="completo">Completo</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p className="historial-empty">No tienes reservas registradas.</p>
      )}

      {historial.prestamos && historial.prestamos.length > 0 ? (
        <>
          <h3 className="historial-subtitle">Préstamos</h3>
          <table className="historial-table">
            <thead>
              <tr>
                <th>Libro</th>
                <th>Autor</th>
                <th>Fecha Préstamo</th>
                <th>Estado de Devolución</th>
                <th>Fecha Devolución</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {historial.prestamos.map((prestamo, index) => (
                <tr key={index}>
                  <td>{prestamo.libro.titulo}</td>
                  <td>{prestamo.libro.autor}</td>
                  <td>{prestamo.fecha_prestamo}</td>
                  <td>{prestamo.devuelto ? "Devuelto" : "Pendiente"}</td>
                  <td>{prestamo.fecha_devolucion}</td>
                  <td>
                    {!prestamo.devuelto && (
                      <button
                        className="historial-devolver-btn"
                        onClick={() => devolverLibro(prestamo.id_prestamo)}
                      >
                        Devolver
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p className="historial-empty">No tienes préstamos registrados.</p>
      )}
    </div>
  );
};

export default Historial;
