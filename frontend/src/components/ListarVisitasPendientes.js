// src/components/ListarVisitasPendientes.js
import React, { useState, useEffect } from 'react';
import { listarVisitas } from '../services/registroVisitaService';
import { useAuth } from '../context/AuthContext';
import { Spinner } from 'react-bootstrap';

const ListarVisitasPendientes = () => {
  const { accessToken } = useAuth();
  const [visitas, setVisitas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisitas = async () => {
      try {
        const data = await listarVisitas(accessToken);
        setVisitas(data);
      } catch (error) {
        console.error('Error al cargar visitas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitas();
  }, [accessToken]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="card shadow-sm rounded-4">
        <div className="card-body">
          <h2 className="mb-4 text-center" style={{ fontWeight: '600' }}>Visitas Registradas</h2>
          {visitas.length === 0 ? (
            <p className="text-center text-muted">No hay visitas registradas.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="text-center">#</th>
                    <th scope="col">Fecha de Visita</th>
                    <th scope="col">Motivo</th>
                    <th scope="col">Resultado</th>
                    <th scope="col">ID Usuario</th>
                    <th scope="col">ID Cliente</th>
                  </tr>
                </thead>
                <tbody>
                  {visitas.map((visita, index) => (
                    <tr key={visita.id_registro_visita}>
                      <td className="text-center">{index + 1}</td>
                      <td>{new Date(visita.fecha_visita).toLocaleDateString()}</td>
                      <td>{visita.motivo_visita || <span className="text-muted">Sin motivo</span>}</td>
                      <td>{visita.resultado_visita || <span className="text-muted">Sin resultado</span>}</td>
                      <td>{visita.id_usuario || <span className="text-muted">N/A</span>}</td>
                      <td>{visita.id_cliente || <span className="text-muted">N/A</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListarVisitasPendientes;
