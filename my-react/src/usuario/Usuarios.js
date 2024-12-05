import CompShowUsuarios from ".usuario/CompShowUsuarios.js";
import CompCreateUsuario from ".usuario/CompCreateUsuario.js";
import CompEditUsuario from ".usuario/CompEditUsuario.js"

const Usuarios = () => {
  return (
    <div className="usuarios-page">
      
      <h2>Gestión de usuarios</h2>

      {/*usuarios */}
      <CompShowUsuarios />

      {/* Crear nuevo usuario */}
      <CompCreateUsuario />

      {/* Editar usuario */}
      {<CompEditUsuario />}

      {/* Eliminar usuario */}
      {<deleteUsuario />}
    </div>
  );
};

export default Usuarios;
