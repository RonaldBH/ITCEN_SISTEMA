import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import { obtenerOrdenesCompra, actualizarOrdenCompra } from '../services/ordenCompraService';
import { crearEntrega, obtenerEntregas } from '../services/entregaService';
import { ClientesContext } from '../context/ClientesContext';
import BotonAcciones from '../elementos/BotonAcciones';
import dayjs from 'dayjs';
import '../styles/ListarOrdenesCompra.css';



const ListarOrdenesCompra = () => {
  const { clientes, loading: clientesLoading } = useContext(ClientesContext);
  const { accessToken } = useAuth();

  // Estados de datos
  const [ordenesCompra, setOrdenesCompra] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados de filtro activos (disparan fetch)
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  // Estados intermedios de inputs de filtro
  const [inputCliente, setInputCliente] = useState('');
  const [inputFechaInicio, setInputFechaInicio] = useState('');
  const [inputFechaFin, setInputFechaFin] = useState('');

  // Modales de entrega
  const [showCrearEntrega, setShowCrearEntrega] = useState(false);
  const [showVerEntregas, setShowVerEntregas] = useState(false);
  const [selectedOrden, setSelectedOrden] = useState(null);
  const [nuevaEntrega, setNuevaEntrega] = useState({
    fecha_entrega: '',
    cantidad_entregada: '',
    estado_entrega: '',
  });
  const [entregasList, setEntregasList] = useState([]);

  // Carga de órdenes cuando cambian los filtros activos
  useEffect(() => {
    const fetchOrdenes = async () => {
      setLoading(true);
      try {
        const filtros = {
          id_cliente: clienteSeleccionado || undefined,
          fecha_inicio: fechaInicio || undefined,
          fecha_fin: fechaFin || undefined,
        };
        const data = await obtenerOrdenesCompra(accessToken, filtros);
        setOrdenesCompra(data);
      } catch (err) {
        console.error('Error al obtener órdenes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrdenes();
  }, [accessToken, clienteSeleccionado, fechaInicio, fechaFin]);

  if (loading || clientesLoading) {
    return <div className="text-center mt-5">Cargando…</div>;
  }

  // Aplica los inputs a los filtros activos
  const aplicarFiltros = () => {
    setClienteSeleccionado(inputCliente);
    setFechaInicio(inputFechaInicio);
    setFechaFin(inputFechaFin);
  };

  // Placeholder handlers
  const emitirFactura = ent => {
    // lógica para emitir factura
    alert(`Emitir factura para entrega #${ent.id_entrega}`);
  };
  const realizarGuia = ent => {
    // lógica para generar guía de remisión
    alert(`Generar guía de remisión para entrega #${ent.id_entrega}`);
  };

  // Estados de respaldo (caso backend no filtre)
  const ordenesFiltradas = ordenesCompra.filter(o =>
    !clienteSeleccionado || o.cliente?.id_cliente === parseInt(clienteSeleccionado, 10)
  );

  const estadosDisponibles = [
    'Emitida', 'Pendiente', 'Procesada',
    'En Camino', 'Entregada', 'Cancelada'
  ];

  // Funciones auxiliares
  const formatDate = fecha =>
    fecha ? new Date(fecha).toLocaleDateString() : '-';

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      const updated = await actualizarOrdenCompra(id, { estado_oc: nuevoEstado }, accessToken);
      setOrdenesCompra(prev =>
        prev.map(o => o.id_orden_compra === id
          ? { ...o, estado_oc: updated.estado_oc }
          : o
        )
      );
    } catch {
      alert('No se pudo actualizar el estado.');
    }
  };

  const manejarGenerarEntrega = orden => {
    setSelectedOrden(orden);
    setNuevaEntrega({ fecha_entrega: '', cantidad_entregada: '', estado_entrega: '' });
    setShowCrearEntrega(true);
  };

  const manejarVerEntregas = async orden => {
    try {
      const lista = await obtenerEntregas(orden.id_orden_compra, accessToken);
      setEntregasList(lista);
      setSelectedOrden(orden);
      setShowVerEntregas(true);
    } catch {
      alert('No se pudieron obtener las entregas.');
    }
  };

  const handleSubmitEntrega = async e => {
    e.preventDefault();
    const { fecha_entrega, cantidad_entregada, estado_entrega } = nuevaEntrega;
    if (!fecha_entrega || !cantidad_entregada || !estado_entrega) {
      return alert('Completa todos los campos de entrega.');
    }
    if (!window.confirm(`¿Crear entrega para OC #${selectedOrden.id_orden_compra}?`)) return;

    try {
      await crearEntrega(
        { ...nuevaEntrega,
          cantidad_entregada: parseFloat(cantidad_entregada),
          id_orden_compra: selectedOrden.id_orden_compra
        },
        accessToken
      );
      alert('Entrega creada con éxito.');
      setShowCrearEntrega(false);
    } catch {
      alert('No se pudo crear la entrega.');
    }
  };

  return (
    <div className="ordenes-container">
      <h2 className="ordenes-title">Órdenes de Compra</h2>

      {/* === Filtros === */}
      <div className="row g-3 align-items-end mb-4">
        <div className="col-md-4">
          <label>Fecha Inicio</label>
          <input
            type="date"
            className="form-control"
            value={inputFechaInicio}
            onChange={e => setInputFechaInicio(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <label>Fecha Fin</label>
          <input
            type="date"
            className="form-control"
            value={inputFechaFin}
            onChange={e => setInputFechaFin(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <label>Cliente</label>
          <select
            className="form-select"
            value={inputCliente}
            onChange={e => setInputCliente(e.target.value)}
          >
            <option value="">Todos los clientes</option>
            {clientes.map(c => (
              <option key={c.id_cliente} value={c.id_cliente}>
                {c.nombre_cliente}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="text-end mb-4">
        <button className="btn-aplicar-filtros" onClick={aplicarFiltros}>
          Aplicar filtros
        </button>
      </div>

      {/* === Tabla === */}
      <div className="table-responsive">
        <table className="ordenes-table">
          <thead>
            <tr>
              <th>ID</th><th>N° Orden</th><th>Código SIGA</th><th>Emisión</th>
              <th>Límite</th><th>Tipo Compra</th><th>Contrato</th><th>Combustible</th>
              <th>Cant.</th><th>Unidad</th><th>Lugar</th><th>Estado</th>
              <th>Total</th><th>Cliente</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ordenesFiltradas.map(o => (
              <tr key={o.id_orden_compra}>
                <td>{o.id_orden_compra}</td>
                <td>{o.numero_orden || '-'}</td>
                <td>{o.codigo_siga}</td>
                <td>{formatDate(o.fecha_emision_oc)}</td>
                <td>{formatDate(o.fecha_limite_entrega)}</td>
                <td>{o.tipo_compra}</td>
                <td>{o.tipo_contrato || '-'}</td>
                <td>{o.tipo_combustible || '-'}</td>
                <td>{o.cantidad ?? '-'}.Gls</td>
                <td>{o.unidad_ejecutora || '-'}</td>
                <td>{o.lugar_entrega_oc}</td>
                <td>
                  <select
                    className={`form-select estado-select ${o.estado_oc.toLowerCase()}`}
                    value={o.estado_oc}
                    onChange={e => cambiarEstado(o.id_orden_compra, e.target.value)}
                  >
                    {estadosDisponibles.map(est => (
                      <option key={est} value={est}>{est}</option>
                    ))}
                  </select>
                </td>
                <td>S/ {o.monto_total_oc.toFixed(2)}</td>
                <td>{o.cliente?.nombre_cliente || '---'}</td>
                <td>
                  <BotonAcciones
                    orden={o}
                    manejarGenerarEntrega={() => manejarGenerarEntrega(o)}
                    manejarVerEntregas={() => manejarVerEntregas(o)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* === Modal Crear Entrega === */}
      {showCrearEntrega && selectedOrden && (
        <div className="modal-overlay">
          <div className="delivery-modal">
            <h3>Ingresar Entrega</h3>
            <p className="info-text">
              OC #{selectedOrden.id_orden_compra} • {selectedOrden.numero_orden}
            </p>
            <form onSubmit={handleSubmitEntrega}>
              <label>Fecha de Entrega</label>
              <input
                type="date"
                className="form-control"
                value={nuevaEntrega.fecha_entrega}
                onChange={e =>
                  setNuevaEntrega({ ...nuevaEntrega, fecha_entrega: e.target.value })
                }
              />
              <label>Cantidad Entregada</label>
              <input
                type="number"
                className="form-control"
                value={nuevaEntrega.cantidad_entregada}
                onChange={e =>
                  setNuevaEntrega({ ...nuevaEntrega, cantidad_entregada: e.target.value })
                }
              />
              <label>Estado de Entrega</label>
              <select
                className="form-control"
                value={nuevaEntrega.estado_entrega}
                onChange={e =>
                  setNuevaEntrega({ ...nuevaEntrega, estado_entrega: e.target.value })
                }
              >
                <option value="">Selecciona estado</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Entregada">Entregada</option>
              </select>
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowCrearEntrega(false)}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* === Modal Ver Entregas === */}
      {showVerEntregas && selectedOrden && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="delivery-modal w-3/4 max-w-2xl p-6">
            <h4 className="text-lg font-semibold mb-4">Entregas de OC #{selectedOrden.numero_orden} - {selectedOrden.cliente?.nombre_cliente} </h4>

            {entregasList.length === 0 ? (
              <div className="alert alert-info mb-4">Sin entregas registradas.</div>
            ) : (
              <div className="table-scroll max-h-80 overflow-y-auto mb-4">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th className="px-3 py-2">Fecha</th>
                      <th className="px-3 py-2">Cantidad</th>
                      <th className="px-3 py-2">Estado</th>
                      <th className="px-3 py-2">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entregasList.map(ent => (
                      <tr key={ent.id_entrega} className="hover:bg-gray-50">
                        <td className="px-3 py-2">{dayjs(ent.fecha_entrega).format('DD/MM/YYYY')}</td>
                        <td className="px-3 py-2">{ent.cantidad_entregada} Gls</td>
                        <td className="px-3 py-2">{ent.estado_entrega}</td>
                        <td className="px-3 py-2 space-x-2">
                          <button
                            className="btn btn-sm btn-primary px-4 py-1"
                            onClick={() => emitirFactura(ent)}
                          >
                            Emitir Factura
                          </button>
                          <button
                            className="btn btn-sm btn-secondary px-4 py-1"
                            onClick={() => realizarGuia(ent)}
                          >
                            Guía Remisión
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="modal-footer text-right">
              <button
                className="btn btn-secondary px-6 py-2"
                onClick={() => setShowVerEntregas(false)}
              >
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