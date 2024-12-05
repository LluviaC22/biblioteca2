import CompShowLibros from './Libro/CompShowLibros.js';
import CompCreateLibro from './Libro/CompCreateLibro.js';
import CompEditLibro from './Libro/CompShowLibros.js';

const Libros = () => {
  return (
    <div className="libros-page">
      
      <h2>Gestión de Libros</h2>

      {/*libros */}
      <CompShowLibros />

      {/* Crear nuevo libro */}
      <CompCreateLibro />

      {/* Editar libro */}
      {<CompEditLibro />}

      {/* Eliminar libro */}
      {<deleteLibro />}
    </div>
  );
};

export default Libros;
