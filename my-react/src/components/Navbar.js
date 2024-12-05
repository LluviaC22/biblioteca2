import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from './assets/logo.jpeg';
import perfilIcon from './assets/perfil.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';
import MenuLateral from './MenuLateral.js';
import { Link } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const [nombreUsuario, setNombreUsuario] = useState('Invitado');
  const [menuLateralAbierto, setMenuLateralAbierto] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const menuLateralRef = useRef(null);

  const toggleMenuLateral = () => {
    setMenuLateralAbierto(!menuLateralAbierto);
  };

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  useEffect(() => {
    const nombre = localStorage.getItem('nombre');
    if (nombre) {
      setNombreUsuario(nombre);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setNombreUsuario('Invitado');
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/configuracion-perfil');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const tiempoRestante = payload.exp * 1000 - Date.now();
      const timeoutId = setTimeout(() => {
        localStorage.clear();
        setNombreUsuario('Invitado');
        navigate('/login');
      }, tiempoRestante > 0 ? tiempoRestante : 0);
      return () => clearTimeout(timeoutId);
    }
  }, [navigate]);

  const isActive = (path) => location.pathname === path;

  return (
    <div>
      <nav className="navbar navbar-expand-lg custom-navbar">
        <div className="container-fluid">
          <div className="d-flex align-items-center">
            <img src={logo} alt="Logo" className="profile-logo" />
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded={!isNavCollapsed ? true : false}
              aria-label="Toggle navigation"
              onClick={handleNavCollapse}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>

          <div className="navbar-title">
            <h5><strong>MARIO HUGO MARINO ORTIZ</strong></h5>
          </div>

          <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarNav">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/inicio') ? 'active' : ''}`} to="/inicio">
                  Inicio
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/catalogo') ? 'active' : ''}`} to="/catalogo">
                  Catálogo
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/historial') ? 'active' : ''}`} to="/historial">
                  Historial
                </Link>
              </li>
              {isAdmin && (
                <>
                  <li className="nav-item">
                    <Link className={`nav-link ${isActive('/libros') ? 'active' : ''}`} to="/libros">
                      Libros
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link ${isActive('/usuarios') ? 'active' : ''}`} to="/usuarios">
                      Usuarios
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="profile d-flex align-items-center" onClick={toggleMenuLateral}>
            <span className="profile-text me-2">{nombreUsuario}</span>
            <img src={perfilIcon} alt="Icono de Perfil" className="profile-icon" />
          </div>
        </div>
      </nav>

      <MenuLateral
        ref={menuLateralRef}
        isOpen={menuLateralAbierto}
        toggleMenu={toggleMenuLateral}
        handleLogout={handleLogout}
        handleProfileClick={handleProfileClick}
      />
    </div>
  );
};

export default Navbar;
