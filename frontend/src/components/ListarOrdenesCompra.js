import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import { obtenerOrdenesCompra, actualizarOrdenCompra } from '../services/ordenCompraService';
import { ClientesContext } from '../context/ClientesContext';
import { Link } from 'react-router-dom';
import '../styles/ListarOrdenesCompra.css';

const ListarOrdenesCompra = () => {
  const [ordenesCompra, setOrdenesCompra] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const { clientes, loading: clientesLoading } = useContext(ClientesContext);
  const { accessToken } = useAuth();

  const estadosDisponibles = [
    'Emitida', 'Pendiente', 'Procesada', 'En Camino', 'Entregada', 'Cancelada'
  ];

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      const datos = { estado_oc: nuevoEstado };
      const updatedOrden = await actualizarOrdenCompra(id, datos, accessToken);
      setOrdenesCompra(prev =>
        prev.map(orden =>
          orden.id_orden_compra === id ? { ...orden, estado_oc: updatedOrden.estado_oc } : orden
        )
      );
    } catch (error) {
      console.error('Error al cambiar el estado de la orden:', error);
      alert('Error al actualizar el estado');
    }
  };

  useEffect(() => {
    const fetchOrdenesCompra = async () => {
      try {
        const ordenes = await obtenerOrdenesCompra(accessToken, clienteSeleccionado, fechaInicio, fechaFin);
        setOrdenesCompra(ordenes);
      } catch (error) {
        console.error("Error al obtener las órdenes de compra:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdenesCompra();
  }, [accessToken, clienteSeleccionado, fechaInicio, fechaFin]);

  if (loading || clientesLoading) {
    return <div className="text-center mt-5">Cargando...</div>;
  }

  return (
    <div className="ordenes-container">
      <h2 className="ordenes-title">Órdenes de Compra</h2>

      {/* Filtros */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <label htmlFor="fechaInicio" className="form-label">Fecha Inicio</label>
          <input
            type="date"
            id="fechaInicio"
            className="form-control"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="fechaFin" className="form-label">Fecha Fin</label>
          <input
            type="date"
            id="fechaFin"
            className="form-control"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="clienteSeleccionado" className="form-label">Filtrar por Cliente</label>
        <select
          id="clienteSeleccionado"
          className="form-select"
          value={clienteSeleccionado}
          onChange={(e) => setClienteSeleccionado(e.target.value)}
        >
          <option value="">Selecciona un cliente</option>
          {clientes.map((cliente) => (
            <option key={cliente.id_cliente} value={cliente.id_cliente}>
              {cliente.nombre_cliente}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla */}
      <div className="table-responsive">
        <table className="ordenes-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>N° Orden</th>
              <th>Código SIGA</th>
              <th>Fecha Emisión</th>
              <th>Fecha Límite</th>
              <th>Tipo Compra</th>
              <th>Tipo Contrato</th>
              <th>Tipo Combustible</th>
              <th>Cantidad</th>
              <th>Unidad Ejecutora</th>
              <th>Lugar Entrega</th>
              <th>Estado</th>
              <th>Monto Total</th>
              <th>Cliente</th>
              <th>Contrato</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ordenesCompra.map((orden) => (
              <tr key={orden.id_orden_compra}>
                <td>{orden.id_orden_compra}</td>
                <td>{orden.numero_orden || '-'}</td>
                <td>{orden.codigo_siga}</td>
                <td>{new Date(orden.fecha_emision_oc).toLocaleDateString()}</td>
                <td>{orden.fecha_limite_entrega ? new Date(orden.fecha_limite_entrega).toLocaleDateString() : '-'}</td>
                <td>{orden.tipo_compra}</td>
                <td>{orden.tipo_contrato || '-'}</td>
                <td>{orden.tipo_combustible || '-'}</td>
                <td>{orden.cantidad ?? '-'}</td>
                <td>{orden.unidad_ejecutora || '-'}</td>
                <td>{orden.lugar_entrega_oc}</td>
                <td>
                  <select
                    className={`form-select estado-select ${orden.estado_oc.toLowerCase()}`}
                    value={orden.estado_oc}
                    onChange={(e) => cambiarEstado(orden.id_orden_compra, e.target.value)}
                  >
                    {estadosDisponibles.map((estado) => (
                      <option key={estado} value={estado}>{estado}</option>
                    ))}
                  </select>
                </td>
                <td>{orden.monto_total_oc.toFixed(2)} USD</td>
                <td>{orden.cliente?.nombre_cliente || 'Desconocido'}</td>
                <td>{orden.id_contrato}</td>
                <td>
                  <Link to={`/orden-compra/${orden.id_orden_compra}`} className="btn-ver">Ver</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListarOrdenesCompra;
