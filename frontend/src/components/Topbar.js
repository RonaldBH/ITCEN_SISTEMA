import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Topbar.css'; 

const Topbar = () => {
  const { user, logout } = useAuth();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLanguageChange = (language) => {
    console.log(`Idioma seleccionado: ${language}`);
    setShowLanguageMenu(false);
  };

  const handleLogout = () => {
    logout();
  };

  const toggleLanguageMenu = () => {
    setShowLanguageMenu(!showLanguageMenu);
    setShowUserMenu(false);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
    setShowLanguageMenu(false);
  };

  return (
    <nav className="navbar navbar-expand navbar-light bg-white shadow-sm mb-4 px-3 topbar-navbar">
      <div className="container-fluid d-flex justify-content-between align-items-center">

        {/* Formulario de búsqueda */}
        <form className="d-flex align-items-center" role="search">
          <input
            className="form-control me-2 rounded-pill shadow-sm"
            type="search"
            placeholder="Buscar..."
            aria-label="Buscar"
            style={{ maxWidth: '250px' }}
          />
          <button className="btn btn-outline-primary rounded-pill shadow-sm" type="submit">
            Buscar
          </button>
        </form>

        {/* Iconos de acciones */}
        <div className="d-flex align-items-center gap-3">

          {/* Configuración de idioma */}
          <div className="dropdown-wrapper">
            <button
              className="icon-btn"
              title="Idioma"
              onClick={toggleLanguageMenu}
            >
              <i className="bi bi-gear fs-5"></i>
            </button>
            {showLanguageMenu && (
              <div className="dropdown-menu-custom">
                <button onClick={() => handleLanguageChange('Español')}>Español</button>
                <button onClick={() => handleLanguageChange('Inglés')}>Inglés</button>
                <button onClick={() => handleLanguageChange('Portugués')}>Portugués</button>
              </div>
            )}
          </div>

          {/* Perfil de usuario */}
          <div className="dropdown-wrapper">
            <button
              className="icon-btn"
              title="Perfil"
              onClick={toggleUserMenu}
            >
              <i className="bi bi-person-circle fs-5"></i>
            </button>
            {showUserMenu && (
              <div className="dropdown-menu-custom">
                <div className="user-info">
                  <strong>{user?.cargo_usuario}</strong>
                  <small className="text-muted d-block">{user?.correo_usuario}</small>
                </div>
                <hr />
                <button onClick={handleLogout} className="btn btn-sm btn-danger w-100">
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Topbar;
