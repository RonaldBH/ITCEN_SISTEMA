import React, { useEffect, useState } from 'react';
import { obtenerSubastas } from '../services/registroSubasta';
import { useAuth } from '../context/AuthContext';
import '../styles/ListarSubastas.css';  // Importamos el archivo CSS

const ListarSubastas = () => {
  const { token } = useAuth();
  const [subastas, setSubastas] = useState([]);

  useEffect(() => {
    const fetchSubastas = async () => {
      try {
        const data = await obtenerSubastas(token);
        setSubastas(data);
      } catch (error) {
        console.error('Error al obtener las subastas:', error);
      }
    };
    fetchSubastas();
  }, [token]);

  return (
    <div className="container mt-4">
      <h2>Listado de Subastas</h2>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Código</th>
              <th>Cantidad</th>
              <th>Estado</th>
              <th>Fecha Inicio</th>
              <th>Fecha Cierre</th>
              <th>Lugar Entrega</th>
              <th>Entregas</th>
            </tr>
          </thead>
          <tbody>
            {subastas.map((subasta) => (
              <tr key={subasta.id_subasta}>
                <td>{subasta.id_subasta}</td>
                <td>{subasta.codigo_subasta}</td>
                <td>{subasta.cantidad_requerida}</td>
                <td>
                  <span className={`badge bg-${subasta.estado === 'pendiente' ? 'warning' : 'success'}`}>
                    {subasta.estado}
                  </span>
                </td>
                <td>{new Date(subasta.fecha_inicio).toLocaleString()}</td>
                <td>{new Date(subasta.fecha_cierre).toLocaleString()}</td>
                <td>{subasta.lugar_entrega}</td>
                <td>{subasta.numero_entregas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListarSubastas;
