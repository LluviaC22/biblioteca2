import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  return isAdmin ? <Component {...rest} /> : <Navigate to="/" />; // Redirige si no es admin
};

export default ProtectedRoute;
