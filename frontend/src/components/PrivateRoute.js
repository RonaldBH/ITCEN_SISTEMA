// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // Verificar si el estado está actualizado correctamente
  console.log('Is Authenticated:', isAuthenticated);

  // Si no estás autenticado, redirige al login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;

