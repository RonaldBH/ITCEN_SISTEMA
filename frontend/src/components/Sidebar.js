import React, { useState } from 'react';

const Sidebar = ({
  user,
  currentContent, // Nuevo prop
  showRegistrarNuevaVisita,
  showListarVisitasPendientes,
  showRegistrarOrdenCompra,
  showListarOrdenesCompra,
  showRegistrarSubasta,
  showListarSubastas,
  onLogout,
  showRegistrarCliente,
  showListarClientes,
  showRegistrarProveedor,
  showListarProveedores,
  showRegistrarCompra,
  showListarCompras,

  showContenidoPrincipal
}) => {
  const [isVisitasOpen, setIsVisitasOpen] = useState(false);
  const [isOCOpen, setIsOCOpen] = useState(false);
  const [isSubastaOpen, setIsSubastaOpen] = useState(false);

  const toggleVisitasDropdown = () => setIsVisitasOpen(!isVisitasOpen);
  const toggleOCDropdown = () => setIsOCOpen(!isOCOpen);
  const toggleSubastaDropdown = () => setIsSubastaOpen(!isSubastaOpen);
  // Dentro de tu componente Sidebar
  const [isClientesOpen, setIsClientesOpen] = useState(false);
  const [isProveedoresOpen, setIsProveedoresOpen] = useState(false);
  const [isComprasOpen, setIsComprasOpen] = useState(false);
  const toggleComprasDropdown = () => setIsComprasOpen(!isComprasOpen);

  const toggleClientesDropdown = () => setIsClientesOpen(!isClientesOpen);
  const toggleProveedoresDropdown = () => setIsProveedoresOpen(!isProveedoresOpen);

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
              Dashboard
            </button>
          </li>

          {/* Registro de Visitas */}
          <li className="mb-3">
            <button className="sidebar-link w-100 text-start" onClick={toggleVisitasDropdown}>
              Visitas
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
              OC
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

          {/* Registro Subasta */}
          <li className="mb-3">
            <button className="sidebar-link w-100 text-start" onClick={toggleSubastaDropdown}>
              Subastas
            </button>
            <div className={`submenu-wrapper ${isSubastaOpen ? 'open' : ''}`}>
              <ul className="list-unstyled ps-3 mt-2">
                <li className="mb-2">
                  <span
                    role="button"
                    onClick={showRegistrarSubasta}
                    className={`submenu-link ${currentContent === 'registrarSubasta' ? 'active' : ''}`}
                  >
                    ▸ Registrar nueva subasta
                  </span>
                </li>
                <li>
                  <span
                    role="button"
                    onClick={showListarSubastas}
                    className={`submenu-link ${currentContent === 'listarSubastas' ? 'active' : ''}`}
                  >
                    ▸ Listar subastas
                  </span>
                </li>
              </ul>
            </div>
          </li>
          {/* Clientes */}
          <li className="mb-3">
            <button className="sidebar-link w-100 text-start" onClick={toggleClientesDropdown}>
              Clientes
            </button>
            <div className={`submenu-wrapper ${isClientesOpen ? 'open' : ''}`}>
              <ul className="list-unstyled ps-3 mt-2">
                <li className="mb-2">
                  <span
                    role="button"
                    onClick={showRegistrarCliente}
                    className={`submenu-link ${currentContent === 'registrarCliente' ? 'active' : ''}`}
                  >
                    ▸ Registrar cliente
                  </span>
                </li>
                <li>
                  <span
                    role="button"
                    onClick={showListarClientes}
                    className={`submenu-link ${currentContent === 'listarClientes' ? 'active' : ''}`}
                  >
                    ▸ Listar clientes
                  </span>
                </li>
              </ul>
            </div>
          </li>

          {/* Proveedores */}
          <li className="mb-3">
            <button className="sidebar-link w-100 text-start" onClick={toggleProveedoresDropdown}>
              Proveedores
            </button>
            <div className={`submenu-wrapper ${isProveedoresOpen ? 'open' : ''}`}>
              <ul className="list-unstyled ps-3 mt-2">
                <li className="mb-2">
                  <span
                    role="button"
                    onClick={showRegistrarProveedor}
                    className={`submenu-link ${currentContent === 'registrarProveedor' ? 'active' : ''}`}
                  >
                    ▸ Registrar proveedor
                  </span>
                </li>
                <li>
                  <span
                    role="button"
                    onClick={showListarProveedores}
                    className={`submenu-link ${currentContent === 'listarProveedores' ? 'active' : ''}`}
                  >
                    ▸ Listar proveedores
                  </span>
                </li>
              </ul>
            </div>
          </li>
          {/* Compras */}
          <li className="mb-3">
            <button className="sidebar-link w-100 text-start" onClick={toggleComprasDropdown}>
              Compras
            </button>
            <div className={`submenu-wrapper ${isComprasOpen ? 'open' : ''}`}>
              <ul className="list-unstyled ps-3 mt-2">
                <li className="mb-2">
                  <span
                    role="button"
                    onClick={showRegistrarCompra}
                    className={`submenu-link ${currentContent === 'registrarCompra' ? 'active' : ''}`}
                  >
                    ▸ Registrar compra
                  </span>
                </li>
                <li>
                  <span
                    role="button"
                    onClick={showListarCompras}
                    className={`submenu-link ${currentContent === 'listarCompras' ? 'active' : ''}`}
                  >
                    ▸ Listar compras
                  </span>
                </li>
              </ul>
            </div>
          </li>

        </ul>

      </nav>

      {/* Logout */}
      <div className="logout-button-container">
        <button className="btn btn-outline-danger w-100 fw-medium" onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>

      {/* Estilos */}
      <style>{`
        .sidebar-container {
          width: 260px;
          height: 100vh;
          background-color:rgba(245, 230, 247, 0.17);
          border-right: 1px solid #e5e5e5;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          overflow-y: auto;
        }

        .sidebar-link {
          padding: 0.5rem 0.75rem;
          border-radius: 12px;
          font-weight: 500;
          color:rgb(0, 0, 0);
          background-color: transparent;
          border: none;
          transition: background-color 0.2s ease, transform 0.2s ease;
        }

        .sidebar-link:hover {
          background-color: rgba(255, 134, 239, 0.23);
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
          background-color: rgba(255, 218, 255, 0.32);
          transform: translateX(6px);
        }

        .sidebar-link.active,
        .submenu-link.active {
          background-color: #ffdaff !important;
          font-weight: 600;
          color: #000;
        }

        /* Scrollbar personalizado para Webkit (Chrome, Edge, Safari) */
        .sidebar-container::-webkit-scrollbar {
          width: 8px;
        }

        .sidebar-container::-webkit-scrollbar-track {
          background: transparent;
        }

        .sidebar-container::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
          border: 2px solid transparent;
          background-clip: content-box;
        }

        .sidebar-container::-webkit-scrollbar-thumb:hover {
          background-color: rgba(0, 0, 0, 0.4);
        }

        /* Scrollbar para Firefox */
        .sidebar-container {
          scrollbar-width: thin;
          scrollbar-color: rgba(254, 184, 219, 0.67) transparent;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
