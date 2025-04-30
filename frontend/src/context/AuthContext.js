import React, { createContext, useContext, useState, useEffect } from 'react';

// Creamos el contexto
const AuthContext = createContext();

// Provider que envuelve toda la app
export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('access_token') || null);
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Error al parsear el usuario:', error);
      return null;
    }
  });

  // Inicializa isAuthenticated con base en el token almacenado
  const [isAuthenticated, setIsAuthenticated] = useState(!!accessToken);

  useEffect(() => {
    // Verifica si hay un token en el localStorage o no
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
    setAccessToken(token);  // Actualiza el token en el estado si existe.
  }, []); // Este efecto solo se ejecuta una vez, al cargar el componente.

  const login = (token, userInfo) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user', JSON.stringify(userInfo));
    setAccessToken(token);
    setUser(userInfo);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setAccessToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ accessToken, isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para acceder al contexto
export const useAuth = () => useContext(AuthContext);
