import React from 'react';
import { Link } from 'react-router-dom';

const MainContent = () => {
  return (
    <div className="container-fluid px-4">
      <h2 className="mb-4 fw-semibold text-dark">Panel Principal</h2>

      {/* Tarjetas resumen */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body">
              <h5 className="card-title">Visitas Pendientes</h5>
              <p className="card-text">5 visitas aún por registrar.</p>
              <Link to="/visitas" className="btn btn-sm btn-outline-primary rounded-pill">
                Ver visitas
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body">
              <h5 className="card-title">Órdenes de Compra</h5>
              <p className="card-text">3 órdenes nuevas esta semana.</p>
              <Link to="/ordenes" className="btn btn-sm btn-outline-primary rounded-pill">
                Revisar OC
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body">
              <h5 className="card-title">Facturas</h5>
              <p className="card-text">2 facturas pendientes de pago.</p>
              <Link to="/facturas" className="btn btn-sm btn-outline-primary rounded-pill">
                Ver facturas
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de contenido principal */}
      <div className="card shadow-sm border-0 rounded-4 mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">Calendario</h5>
          <p className="text-muted">Aquí se integrará el componente de calendario o actividades.</p>
        </div>
      </div>

      {/* Guías rápidas o links útiles */}
      <div className="row">
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body">
              <h6 className="fw-bold">Guías rápidas</h6>
              <ul className="list-unstyled mt-3 mb-0">
                <li><Link to="/registro-visita" className="text-decoration-none text-primary">+ Registrar nueva visita</Link></li>
                <li><Link to="/registro-oc" className="text-decoration-none text-primary">+ Registrar nueva OC</Link></li>
                <li><Link to="/registro-subasta" className="text-decoration-none text-primary">+ Registrar subasta</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
