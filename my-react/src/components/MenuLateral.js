import React from 'react';
import './MenuLateral.css';

const MenuLateral = ({ isOpen, toggleMenu, handleLogout, handleProfileClick }) => {
  const isAuthenticated = localStorage.getItem('nombre'); // Verifica si hay un nombre guardado, lo que indicaría que el usuario está autenticado

  return (
    <div className={`menu-lateral ${isOpen ? 'open' : ''}`}>
      <button className="close-btn" onClick={toggleMenu}>×</button>
      <ul>
        {/* Mostrar "Perfil" solo si el usuario está autenticado */}
        {isAuthenticated ? (
          <>
            <li className="menu-item" onClick={handleProfileClick}>Perfil</li>
            <li className="menu-item" onClick={handleLogout}>Cerrar Sesión</li>
          </>
        ) : (
          <li onClick={() => window.location.href = "/login"}>Iniciar sesión</li>
        )}
      </ul>
    </div>
  );
};

export default MenuLateral;
