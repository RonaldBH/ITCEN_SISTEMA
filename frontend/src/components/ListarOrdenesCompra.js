import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import { obtenerOrdenesCompra, actualizarOrdenCompra } from '../services/ordenCompraService';
import { crearEntrega, obtenerEntregas } from '../services/entregaService';
import { ClientesContext } from '../context/ClientesContext';
import '../styles/ListarOrdenesCompra.css';
import BotonAcciones from '../elementos/BotonAcciones';
import dayjs from 'dayjs';

const ListarOrdenesCompra = () => {
  const [ordenesCompra, setOrdenesCompra] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  // Estados para gestión de entregas
  const [showCrearEntrega, setShowCrearEntrega] = useState(false);
  const [showVerEntregas, setShowVerEntregas] = useState(false);
  const [selectedOrden, setSelectedOrden] = useState(null);
  const [nuevaEntrega, setNuevaEntrega] = useState({
    fecha_entrega: '',
    cantidad_entregada: '',
    estado_entrega: '',
  });
  const [entregasList, setEntregasList] = useState([]);

  const { clientes, loading: clientesLoading } = useContext(ClientesContext);
  const { accessToken } = useAuth();

  // Abrir modal para crear entrega
  const manejarGenerarEntrega = (orden) => {
    setSelectedOrden(orden);
    setShowCrearEntrega(true);
    setNuevaEntrega({ fecha_entrega: '', cantidad_entregada: '', estado_entrega: '' });
  };

  // Abrir modal para ver entregas
  const manejarVerEntregas = async (orden) => {
    try {
      const response = await obtenerEntregas(orden.id_orden_compra, accessToken);
      setEntregasList(response);
      setSelectedOrden(orden);
      setShowVerEntregas(true);
    } catch (error) {
      console.error('Error al obtener las entregas:', error);
      alert('Hubo un error al obtener las entregas.');
    }
  };

  // Envío de nueva entrega
  const handleSubmitEntrega = async (e) => {
    e.preventDefault();
    const { fecha_entrega, cantidad_entregada, estado_entrega } = nuevaEntrega;

    if (!fecha_entrega || !cantidad_entregada || !estado_entrega) {
      alert('Todos los campos de entrega son obligatorios.');
      return;
    }

    if (!window.confirm(`¿Deseas generar una entrega para la Orden #${selectedOrden.id_orden_compra}?`)) {
      return;
    }

    try {
      const payload = {
        ...nuevaEntrega,
        cantidad_entregada: parseFloat(cantidad_entregada),
        id_orden_compra: selectedOrden.id_orden_compra,
      };
      const response = await crearEntrega(payload, accessToken);
      alert(`Entrega generada con éxito (ID: ${response.id_entrega})`);
      setShowCrearEntrega(false);
    } catch (error) {
      console.error('Error al generar entrega:', error);
      alert('Hubo un error al generar la entrega.');
    }
  };

  // Cambiar estado de la orden
  const estadosDisponibles = ['Emitida', 'Pendiente', 'Procesada', 'En Camino', 'Entregada', 'Cancelada'];
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
        console.error('Error al obtener las órdenes de compra:', error);
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
                <td>S/ {orden.monto_total_oc.toFixed(2)}</td>
                <td>{orden.cliente?.nombre_cliente || 'Desconocido'}</td>
                <td>{orden.id_contrato}</td>
                <td>
                  <BotonAcciones
                    orden={orden}
                    manejarGenerarEntrega={manejarGenerarEntrega}
                    manejarVerEntregas={manejarVerEntregas}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Entrega */}
      {showCrearEntrega && selectedOrden && (
        <div className="modal-overlay">
          <div className="delivery-modal">
            <h3>Ingresar Entrega</h3>
            <p className="info-text">
              Orden de Compra #{selectedOrden.id_orden_compra} - {selectedOrden.numero_orden}
            </p>
            <form onSubmit={handleSubmitEntrega}>
              <label htmlFor="fecha_entrega">Fecha de Entrega</label>
              <input
                type="date"
                id="fecha_entrega"
                className="form-control"
                value={nuevaEntrega.fecha_entrega}
                onChange={(e) => setNuevaEntrega({ ...nuevaEntrega, fecha_entrega: e.target.value })}
              />
              <label htmlFor="cantidad_entregada">Cantidad Entregada</label>
              <input
                type="number"
                id="cantidad_entregada"
                className="form-control"
                value={nuevaEntrega.cantidad_entregada}
                onChange={(e) => setNuevaEntrega({ ...nuevaEntrega, cantidad_entregada: e.target.value })}
              />
              <label htmlFor="estado_entrega">Estado de Entrega</label>
              <select
                id="estado_entrega"
                className="form-control"
                value={nuevaEntrega.estado_entrega}
                onChange={(e) => setNuevaEntrega({ ...nuevaEntrega, estado_entrega: e.target.value })}
              >
                <option value="">Seleccione un estado</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Entregada">Entregada</option>
              </select>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowCrearEntrega(false)} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">Guardar Entrega</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Ver entregas */}
      {showVerEntregas && selectedOrden && (
        <div className="modal-overlay">
          <div className="delivery-modal">
            <h3>Entregas de Orden #{selectedOrden.numero_orden}</h3>
            <table className="entregas-table">
              <thead>
                <tr>
                  <th>Fecha de Entrega</th>
                  <th>Cantidad Entregada</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {entregasList.length === 0 ? (
                  <tr>
                    <td colSpan="3">No hay entregas registradas.</td>
                  </tr>
                ) : (
                  entregasList.map((entrega) => (
                    <tr key={entrega.id_entrega}>
                      <td>{dayjs(entrega.fecha_entrega).format('DD/MM/YYYY')}</td>
                      <td>{entrega.cantidad_entregada}</td>
                      <td>{entrega.estado_entrega}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="modal-footer">
              <button type="button" onClick={() => setShowVerEntregas(false)} className="btn btn-secondary">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListarOrdenesCompra;
