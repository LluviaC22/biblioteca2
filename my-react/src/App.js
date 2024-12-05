import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.js';
import CompResultadosBusqueda from './components/ResultadoBusqueda.js';
import CompReservaForm from './components/FormularioReserva.js';
import CompPrestarForm from './components/FormularioPrestamo.js';
import Inicio from './components/Inicio.js';
import CompCatalogo from './components/Catalogo.js';
import Historial from './components/Historial.js';
import NotFound from './components/NotFound.js';
import ConfiguracionPerfil from './components/ConfiguracionPerfil.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from './components/Footer.js';
import ProtectedRoute from './ProtectedRoute.js';
import Restablecer from './components/Restablecer.js';
import RestablecerContrasena from './components/RestablecerContrasena.js';
import CompShowLibros from './libro/ShowLibros.js';
import CompCreateLibro from './libro/CreateLibro.js';
import CompEditLibro from './libro/EditLibro.js';
import Login from './components/Login.js';
import Registro from './components/Registro.js';
import CompCreateUsuario from './usuario/CreateUsuario.js';
import CompShowUsuarios from './usuario/ShowUsuarios.js';

import CompEditUsuario from './usuario/EditUsuario.js';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh', 
        backgroundColor: '#FFFFFF' /* Fondo blanco */,
      }}>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path='/inicio' element={<Inicio />} />
        <Route path="/historial" element={<Historial />} />
        <Route path="/configuracion-perfil" element={<ConfiguracionPerfil />} />
        <Route path="*" element={<NotFound />} />
        <Route path='/catalogo' element={<CompCatalogo />} />
        <Route path='/resultados/:termino' element={<CompResultadosBusqueda />} />
        <Route path='/restablecer' element={<Restablecer />} />
        <Route path='/restablecer/:token' element={<RestablecerContrasena />} />
        <Route path='/restablecer-contrasena/:token' element={<RestablecerContrasena />} />
        <Route path='/reservar/:id_libro' element={<CompReservaForm />} />
        <Route path="/prestar/:id_libro" element={<CompPrestarForm />} />
        {/* Rutas protegidas - solo accesibles para el Admin */}
        <Route
          path='/libros'
          element={<ProtectedRoute component={CompShowLibros} />}
        />
        <Route
          path='/create'
          element={<ProtectedRoute component={CompCreateLibro} />}
        />
        <Route
          path='/edit/:id_libro'
          element={<ProtectedRoute component={CompEditLibro} />}
        />
        <Route
          path='/usuarios'
          element={<ProtectedRoute component={CompShowUsuarios} />}
        />
        <Route
          path='/create-usuario'
          element={<ProtectedRoute component={CompCreateUsuario} />}
        />
        <Route
          path='/edit-usuario/:id_usuario'
          element={<ProtectedRoute component={CompEditUsuario} />}
        />
      </Routes>
      <Footer />
      </div>
    </BrowserRouter>
  );
}





export default App;
