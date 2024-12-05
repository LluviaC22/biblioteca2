import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ResultadoBusqueda.css"; 

const CompResultadosBusqueda = () => {
  const { termino } = useParams(); // Obtiene el término de búsqueda de la URL
  const [libros, setLibros] = useState([]); // Estado para almacenar los resultados
  const [error, setError] = useState(""); // Estado para almacenar el error
  const [isLoading, setIsLoading] = useState(true); // Estado para manejar la carga
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchLibros = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/libros/buscar/${termino}`);
        setLibros(response.data); // Almacena los libros obtenidos
      } catch (err) {
        setError("Error al cargar los libros."); // En caso de error, muestra un mensaje
      } finally {
        setIsLoading(false); // Termina la carga
      }
    };

    fetchLibros(); // Llama a la función para obtener los libros cuando se monta el componente
  }, [termino]);

  // Función para redirigir al formulario de reserva y préstamo del libro
  const handleReservar = (id_libro, titulo) => {
    navigate(`/reservar/${id_libro}`, { state: { titulo } });
  };
  
  
  const handlePedirPrestado = (id_libro) => {
    navigate(`/prestar/${id_libro}`);
  };
  

  return (
    <div className="resultado-bus-container">
      <h2 className="resultado-title">
        Resultados de la búsqueda {termino ? `para "${termino}"` : ""}
      </h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {libros.length > 0 ? (
        <table className="resultado-table">
          <thead>
            <tr>
              <th>Autor</th>
              <th>Título</th>
              <th>Acción</th> 
            </tr>
          </thead>
          <tbody>
            {libros.map((libro) => (
              <tr key={libro.id_libro}>
                <td>{libro.autor}</td>
                <td>{libro.titulo}</td>
                <td>
                  <button
                    className="btn-reservar"
                    onClick={() => handleReservar(libro.id_libro, libro.titulo)} // Redirige al formulario de reserva
                  >
                    Reservar
                  </button>
                  <button
                    className="btn-prestar"
                    onClick={() => handlePedirPrestado(libro.id_libro, libro.titulo)} // Redirige al formulario de préstamo
                  >
                    Pedir prestado
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-muted">
          {termino ? `No se encontraron libros para "${termino}"` : "Realiza una búsqueda para ver resultados."}
        </p>
      )}
    </div>
  );
};

export default CompResultadosBusqueda;
