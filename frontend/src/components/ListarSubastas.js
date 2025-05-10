import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { obtenerSubastas, actualizarSubasta } from '../services/registroSubasta';
import {
  obtenerContrato,
  crearContrato,
  actualizarContrato
} from '../services/servicesContrato';
import { obtenerClientes } from '../services/clientesService';
import BotonAccionesSubasta from '../elementos/BotonAccionesSubasta';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faTimesCircle,
  faClock,
  faFlagCheckered
} from '@fortawesome/free-solid-svg-icons';
import '../styles/ListarSubastas.css';

const ListarSubastas = () => {
  const { token } = useAuth();

  // Datos principales
  const [subastas, setSubastas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaCierre, setFechaCierre] = useState('');

  // Modal Asociar / Ver
  const [showAsociar, setShowAsociar] = useState(false);
  const [showVer, setShowVer] = useState(false);
  const [selected, setSelected] = useState(null);

  // Formulario Contrato
  const [fechaFirma, setFechaFirma] = useState('');
  const [estadoContrato, setEstadoContrato] = useState('');
  const [montoTotal, setMontoTotal] = useState('');
  const [clienteId, setClienteId] = useState('');

  // Clientes para select
  const [clientes, setClientes] = useState([]);

  // Error al cargar/ver contrato
  const [contratoError, setContratoError] = useState('');

  // Fetch subastas y clientes
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const params = {};
        if (fechaInicio) params.fecha_inicio = fechaInicio;
        if (fechaCierre) params.fecha_cierre = fechaCierre;
        const subs = await obtenerSubastas(token, params);
        const cls = await obtenerClientes(token);
        setSubastas(subs);
        setClientes(cls);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [token, fechaInicio, fechaCierre]);

  // Cambiar estado de subasta
  const cambiarEstado = async (id, estado) => {
    try {
      const updated = await actualizarSubasta(id, { estado }, token);
      setSubastas(prev =>
        prev.map(s => (s.id_subasta === id ? { ...s, estado: updated.estado } : s))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Icono de estado
  const iconoEstado = est => {
    switch (est) {
      case 'nuevo': return <FontAwesomeIcon icon={faClock} className="text-warning" />;
      case 'pendiente': return <FontAwesomeIcon icon={faFlagCheckered} className="text-primary" />;
      case 'ganado': return <FontAwesomeIcon icon={faCheckCircle} className="text-success" />;
      case 'perdido': return <FontAwesomeIcon icon={faTimesCircle} className="text-danger" />;
      case 'terminado': return <FontAwesomeIcon icon={faFlagCheckered} className="text-muted" />;
      default: return null;
    }
  };

  // Abrir modal Asociar Contrato (sin lógica adicional)
  const openAsociar = sub => {
    setSelected(sub);
    setFechaFirma('');
    setEstadoContrato('');
    setMontoTotal('');
    setClienteId('');
    setShowAsociar(true);
  };

  // Abrir modal Ver Contrato: fetch primero, luego show
  const openVer = async sub => {
    setSelected(sub);
    setContratoError('');

    if (!sub.contrato?.id_contrato) {
      setContratoError('No hay contrato asociado.');
      setShowVer(true);
      return;
    }

    try {
      const c = await obtenerContrato(sub.contrato.id_contrato, token);
      setSelected({ ...sub, contrato: c });
    } catch (err) {
      console.error('Error al obtener contrato', err);
      setContratoError('Error al obtener el contrato.');
    }

    setShowVer(true);
  };

  // Guardar o crear contrato
  const saveContrato = async () => {
    if (!fechaFirma || !estadoContrato || !montoTotal || !clienteId) {
      return alert('Completa todos los campos.');
    }
    const datos = {
      fecha_firma: fechaFirma,
      estado_contrato: estadoContrato,
      monto_total_contrato: parseFloat(montoTotal),
      id_cliente: clienteId,
      id_subasta: selected.id_subasta,
    };
    try {
      let result;
      if (selected.contrato?.id_contrato) {
        result = await actualizarContrato(selected.contrato.id_contrato, datos, token);
      } else {
        result = await crearContrato(datos, token);
      }
      setSubastas(prev =>
        prev.map(s =>
          s.id_subasta === selected.id_subasta ? { ...s, contrato: result } : s
        )
      );
      setShowAsociar(false);
      alert('Contrato guardado correctamente.');
    } catch (err) {
      console.error('Error al guardar contrato', err);
      alert('Error al guardar contrato.');
    }
  };

  if (loading) return <div className="text-center mt-5">Cargando subastas…</div>;

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Listado de Subastas</h2>

      {/* Filtros */}
      <div className="row mb-3">
        <div className="col-md-4">
          <label>Fecha Inicio</label>
          <input
            type="date"
            className="form-control"
            value={fechaInicio}
            onChange={e => setFechaInicio(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <label>Fecha Cierre</label>
          <input
            type="date"
            className="form-control"
            value={fechaCierre}
            onChange={e => setFechaCierre(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla */}
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
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {subastas.map(s => (
              <tr key={s.id_subasta}>
                <td>{s.id_subasta}</td>
                <td>{s.codigo_subasta}</td>
                <td>{s.cantidad_requerida}</td>
                <td>{s.tipo_combustible}</td>
                <td>
                  <span className="d-flex align-items-center">
                    {iconoEstado(s.estado)}<span className="ms-2">{s.estado}</span>
                  </span>
                </td>
                <td>{new Date(s.fecha_inicio).toLocaleDateString()}</td>
                <td>{new Date(s.fecha_cierre).toLocaleDateString()}</td>
                <td>{s.lugar_entrega}</td>
                <td>{s.numero_entregas}</td>
                <td>{s.contrato?.numero_contrato || '-'}</td>
                <td>{(s.documento || []).length}</td>
                <td>
                  <select
                    className="form-select estado-select"
                    value={s.estado}
                    onChange={e => cambiarEstado(s.id_subasta, e.target.value)}
                  >
                    <option value="nuevo">Nuevo</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="ganado">Ganado</option>
                    <option value="perdido">Perdido</option>
                    <option value="terminado">Finalizado</option>
                  </select>
                </td>
                <td>
                  <BotonAccionesSubasta
                    subasta={s}
                    manejarAsociarContrato={openAsociar}
                    manejarVerContrato={openVer}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Asociar Contrato */}
      {showAsociar && selected && (
        <div className="modal-overlay">
          <div className="delivery-modal">
            <h4>Asociar Contrato a Subasta #{selected.id_subasta}</h4>

            <label>Fecha Firma</label>
            <input
              type="date"
              className="form-control mb-2"
              value={fechaFirma}
              onChange={e => setFechaFirma(e.target.value)}
            />

            <label>Estado Contrato</label>
            <select
              className="form-control mb-2"
              value={estadoContrato}
              onChange={e => setEstadoContrato(e.target.value)}
            >
              <option value="">Selecciona estado</option>
              <option value="Activo">Activo</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Cancelado">Cancelado</option>
            </select>

            <label>Monto Total</label>
            <input
              type="number"
              className="form-control mb-2"
              placeholder="S/ 0.00"
              step="0.01"
              value={montoTotal}
              onChange={e => setMontoTotal(e.target.value)}
            />

            <label>Cliente</label>
            <select
              className="form-control mb-3"
              value={clienteId}
              onChange={e => setClienteId(e.target.value)}
            >
              <option value="">Selecciona cliente</option>
              {clientes.map(c => (
                <option key={c.id_cliente} value={c.id_cliente}>
                  {c.nombre_cliente}
                </option>
              ))}
            </select>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAsociar(false)}>
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={saveContrato}>
                Guardar Contrato
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ver Contrato */}
      {showVer && selected && (
        <div className="modal-overlay">
          <div className="delivery-modal">
            <h4>Contrato de Subasta #{selected.id_subasta}</h4>

            {contratoError ? (
              <div className="alert alert-danger">{contratoError}</div>
            ) : selected.contrato ? (
              <>
                <p><strong>ID Contrato:</strong> {selected.contrato.id_contrato}</p>
                <p><strong>Fecha Firma:</strong> {new Date(selected.contrato.fecha_firma).toLocaleDateString()}</p>
                <p><strong>Estado:</strong> {selected.contrato.estado_contrato}</p>
                <p><strong>Monto:</strong> S/ {selected.contrato.monto_total_contrato.toFixed(2)}</p>
                <p><strong>Cliente ID:</strong> {selected.contrato.id_cliente}</p>
              </>
            ) : (
              <p className="text-muted">Cargando contrato…</p>
            )}

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowVer(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListarSubastas;
