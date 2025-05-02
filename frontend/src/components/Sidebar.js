import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ user, showRegistrarNuevaVisita, showListarVisitasPendientes, onLogout, showContenidoPrincipal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setIsOpen(!isOpen);
  const toggleSidebar = () => setShowSidebar(!showSidebar);

  return (
    <>
      {/* Botón hamburguesa solo visible en móviles */}
      <button
        className="btn btn-light d-md-none m-2"
        onClick={toggleSidebar}
      >
        <i className="bi bi-list fs-3"></i>
      </button>

      {/* Sidebar visible solo en md y superior, o si está abierto */}
      <div className={`sidebar-container ${showSidebar ? 'd-block' : 'd-none'} d-md-block flex-column p-4`}>
        {/* Usuario */}
        <div className="mb-4">
          <h5 className="fw-semibold text-dark">{user?.nombre || 'Usuario'}</h5>
        </div>

        {/* Navegación */}
        <nav className="flex-grow-1">
          <ul className="list-unstyled">

            <li className="mb-3">
              <button onClick={showContenidoPrincipal} className="sidebar-link w-100 text-start">
                Principal
              </button>
            </li>

            <li className="mb-3">
              <button className="sidebar-link w-100 text-start" onClick={toggleDropdown}>
                Registro de Visitas
              </button>
              <div className={`submenu-wrapper ${isOpen ? 'open' : ''}`}>
                <ul className="list-unstyled ps-3 mt-2">
                  <li className="mb-2">
                    <span role="button" onClick={showRegistrarNuevaVisita} className="submenu-link">▸ Registrar nueva visita</span>
                  </li>
                  <li>
                    <span role="button" onClick={showListarVisitasPendientes} className="submenu-link">▸ Listar visitas pendientes</span>
                  </li>
                </ul>
              </div>
            </li>

            <li className="mb-3">
              <button onClick={() => navigate('/dashboard')} className="sidebar-link w-100 text-start">
                Registro OC
              </button>
            </li>

            <li className="mb-3">
              <button onClick={() => navigate('/dashboard')} className="sidebar-link w-100 text-start">
                Registro Subasta
              </button>
            </li>
          </ul>
        </nav>

        <div className="mt-auto">
          <button className="btn btn-outline-danger w-100 fw-medium" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Estilos personalizados */}
      <style>{`
        .sidebar-container {
          width: 260px;
          height: 100vh;
          background-color: #f8f9fa;
          border-right: 1px solid #e5e5e5;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          overflow-y: auto;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 1040;
        }

        .sidebar-link {
          padding: 0.5rem 0.75rem;
          border-radius: 12px;
          font-weight: 500;
          color: #212529;
          background-color: transparent;
          border: none;
          transition: background-color 0.2s ease, transform 0.2s ease;
        }

        .sidebar-link:hover {
          background-color: rgba(0, 0, 0, 0.05);
          transform: translateX(4px);
        }

        .submenu-wrapper {
          overflow: hidden;
          max-height: 0;
          opacity: 0;
          transition: max-height 0.4s ease, opacity 0.4s ease;
        }

        .submenu-wrapper.open {
          max-height: 200px;
          opacity: 1;
        }

        .submenu-link {
          display: block;
          padding: 0.4rem 0.75rem;
          border-radius: 8px;
          font-weight: 400;
          color: #555;
          cursor: pointer;
          transition: background-color 0.2s ease, transform 0.2s ease;
        }

        .submenu-link:hover {
          background-color: rgba(0, 0, 0, 0.05);
          transform: translateX(6px);
        }
      `}</style>
    </>
  );
};

export default Sidebar;