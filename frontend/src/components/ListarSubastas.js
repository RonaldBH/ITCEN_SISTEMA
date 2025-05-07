import React, { useEffect, useState } from 'react';
import { obtenerSubastas, actualizarSubasta } from '../services/registroSubasta';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faClock, faFlagCheckered } from '@fortawesome/free-solid-svg-icons';
import '../styles/ListarSubastas.css';

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

  const cambiarEstado = async (id, estado) => {
    try {
      const subastaData = { estado };
      const updatedSubasta = await actualizarSubasta(id, subastaData, token);
      setSubastas(subastas.map(subasta => 
        subasta.id_subasta === id ? { ...subasta, estado: updatedSubasta.estado } : subasta
      ));
    } catch (error) {
      console.error('Error al actualizar el estado de la subasta:', error);
    }
  };

  const obtenerIconoEstado = (estado) => {
    switch (estado) {
      case 'nuevo':
        return <FontAwesomeIcon icon={faClock} className="text-warning" />;
      case 'pendiente':
        return <FontAwesomeIcon icon={faFlagCheckered} className="text-primary" />;
      case 'ganado':
        return <FontAwesomeIcon icon={faCheckCircle} className="text-success" />;
      case 'perdido':
        return <FontAwesomeIcon icon={faTimesCircle} className="text-danger" />;
      case 'terminado':
        return <FontAwesomeIcon icon={faFlagCheckered} className="text-muted" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Listado de Subastas</h2>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="thead-dark">
            <tr>
              <th>ID</th>
              <th>Código</th>
              <th>Cantidad</th>
              <th>Tipo Combustible</th>
              <th>Estado</th>
              <th>Fecha Inicio</th>
              <th>Fecha Cierre</th>
              <th>Lugar Entrega</th>
              <th>Entregas</th>
              <th>Contrato</th>
              <th>Documentos</th>
              <th>Actualizar Estado</th>
            </tr>
          </thead>
          <tbody>
            {subastas.map((subasta) => (
              <tr key={subasta.id_subasta}>
                <td>{subasta.id_subasta}</td>
                <td>{subasta.codigo_subasta}</td>
                <td>{subasta.cantidad_requerida}</td>
                <td>{subasta.tipo_combustible}</td>
                <td>
                  <span className="d-flex align-items-center">
                    {obtenerIconoEstado(subasta.estado)}
                    <span className="ms-2">{subasta.estado.charAt(0).toUpperCase() + subasta.estado.slice(1)}</span>
                  </span>
                </td>
                <td>{new Date(subasta.fecha_inicio).toLocaleString()}</td>
                <td>{new Date(subasta.fecha_cierre).toLocaleString()}</td>
                <td>{subasta.lugar_entrega}</td>
                <td>{subasta.numero_entregas}</td>
                <td>{subasta.contrato?.numero_contrato || <span className="text-muted">N/D</span>}</td>
                <td>{subasta.documento?.length || 0}</td>
                <td>
                <select
                  className="form-select estado-select"
                  value={subasta.estado}
                  onChange={(e) => cambiarEstado(subasta.id_subasta, e.target.value)}
                >
                  <option value="nuevo">Nuevo</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="ganado">Ganado</option>
                  <option value="perdido">Perdido</option>
                  <option value="terminado">Finalizada</option>
                </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListarSubastas;
