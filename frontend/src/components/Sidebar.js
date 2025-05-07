import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({
  user,
  currentContent, // Nuevo prop
  showRegistrarNuevaVisita,
  showListarVisitasPendientes,
  showRegistrarOrdenCompra,
  showListarOrdenesCompra,
  onLogout,
  showContenidoPrincipal
}) => {
  const [isVisitasOpen, setIsVisitasOpen] = useState(false);
  const [isOCOpen, setIsOCOpen] = useState(false);
  const navigate = useNavigate();

  const toggleVisitasDropdown = () => setIsVisitasOpen(!isVisitasOpen);
  const toggleOCDropdown = () => setIsOCOpen(!isOCOpen);

  return (
    <div className="d-flex flex-column p-4 sidebar-container">
      {/* Usuario */}
      <div className="mb-4">
        <h5 className="fw-semibold text-dark">{user?.nombre || 'Usuario'}</h5>
      </div>

      {/* Navegación */}
      <nav className="flex-grow-1">
        <ul className="list-unstyled">

          <li className="mb-3">
            <button
              onClick={showContenidoPrincipal}
              className={`sidebar-link w-100 text-start ${currentContent === '' ? 'active' : ''}`}
            >
              Principal
            </button>
          </li>

          {/* Registro de Visitas */}
          <li className="mb-3">
            <button className="sidebar-link w-100 text-start" onClick={toggleVisitasDropdown}>
              Registro de Visitas
            </button>
            <div className={`submenu-wrapper ${isVisitasOpen ? 'open' : ''}`}>
              <ul className="list-unstyled ps-3 mt-2">
                <li className="mb-2">
                  <span
                    role="button"
                    onClick={showRegistrarNuevaVisita}
                    className={`submenu-link ${currentContent === 'registrarVisita' ? 'active' : ''}`}
                  >
                    ▸ Registrar nueva visita
                  </span>
                </li>
                <li>
                  <span
                    role="button"
                    onClick={showListarVisitasPendientes}
                    className={`submenu-link ${currentContent === 'listarVisitas' ? 'active' : ''}`}
                  >
                    ▸ Listar visitas pendientes
                  </span>
                </li>
              </ul>
            </div>
          </li>

          {/* Registro OC */}
          <li className="mb-3">
            <button className="sidebar-link w-100 text-start" onClick={toggleOCDropdown}>
              Registro OC
            </button>
            <div className={`submenu-wrapper ${isOCOpen ? 'open' : ''}`}>
              <ul className="list-unstyled ps-3 mt-2">
                <li className="mb-2">
                  <span
                    role="button"
                    onClick={showRegistrarOrdenCompra}
                    className={`submenu-link ${currentContent === 'registrarOC' ? 'active' : ''}`}
                  >
                    ▸ Registrar nueva orden
                  </span>
                </li>
                <li>
                  <span
                    role="button"
                    onClick={showListarOrdenesCompra}
                    className={`submenu-link ${currentContent === 'listarOC' ? 'active' : ''}`}
                  >
                    ▸ Listar órdenes de compra
                  </span>
                </li>
              </ul>
            </div>
          </li>

          <li className="mb-3">
            <button onClick={() => navigate('/dashboard')} className="sidebar-link w-100 text-start">
              Registro Subasta
            </button>
          </li>
        </ul>
      </nav>

      {/* Logout */}
      <div className="mt-auto">
        <button className="btn btn-outline-danger w-100 fw-medium" onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>

      {/* Estilos */}
      <style>{`
        .sidebar-container {
          width: 260px;
          height: 100vh;
          background-color: #f8f9fa;
          border-right: 1px solid #e5e5e5;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          overflow-y: auto;
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

        .sidebar-link.active,
        .submenu-link.active {
          background-color: #ffdaff !important;
          font-weight: 600;
          color: #000;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;


