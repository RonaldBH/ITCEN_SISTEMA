import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { obtenerSubastas, actualizarSubasta } from '../services/registroSubasta';
import {obtenerContratosPorSubasta,crearContrato,actualizarContrato} from '../services/servicesContrato';
import { obtenerClientes } from '../services/clientesService';
import BotonAccionesSubasta from '../elementos/BotonAccionesSubasta';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCheckCircle,faTimesCircle,faClock,faFlagCheckered} from '@fortawesome/free-solid-svg-icons';
import '../styles/ListarSubastas.css';

const ListarSubastas = () => {
  const { token } = useAuth();

  // Datos principales
  const [subastas, setSubastas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaCierre, setFechaCierre] = useState('');

  // Selección y modales
  const [selected, setSelected] = useState(null);
  const [showAsociar, setShowAsociar] = useState(false);
  const [showVer, setShowVer] = useState(false);

  // Formulario Contrato (Asociar)
  const [fechaFirma, setFechaFirma] = useState('');
  const [estadoContrato, setEstadoContrato] = useState('');
  const [montoTotal, setMontoTotal] = useState('');
  const [clienteId, setClienteId] = useState('');

  // Datos auxiliares
  const [clientes, setClientes] = useState([]);
  const [contratosAsociados, setContratosAsociados] = useState([]);
  const [contratoError, setContratoError] = useState('');

  // Carga inicial de subastas y clientes
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
      const upd = await actualizarSubasta(id, { estado }, token);
      setSubastas(prev =>
        prev.map(s => s.id_subasta === id ? { ...s, estado: upd.estado } : s)
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Iconos de estado
  const iconoEstado = est => {
    switch (est) {
      case 'nuevo':     return <FontAwesomeIcon icon={faClock} className="text-warning" />;
      case 'pendiente': return <FontAwesomeIcon icon={faFlagCheckered} className="text-primary" />;
      case 'ganado':    return <FontAwesomeIcon icon={faCheckCircle} className="text-success" />;
      case 'perdido':   return <FontAwesomeIcon icon={faTimesCircle} className="text-danger" />;
      case 'terminado': return <FontAwesomeIcon icon={faFlagCheckered} className="text-muted" />;
      default:          return null;
    }
  };

  // Abre modal “Asociar Contrato”
// Abre modal “Asociar Contrato”
const openAsociar = sub => {
  setSelected(sub);

  if (sub.contrato) {
    const { fecha_firma, estado_contrato, monto_total_contrato, id_cliente } = sub.contrato;

    // Solo split si fecha_firma es una cadena válida
    setFechaFirma(fecha_firma ? fecha_firma.split('T')[0] : '');

    // Validaciones de resto de campos
    setEstadoContrato(estado_contrato || '');
    setMontoTotal(monto_total_contrato != null ? monto_total_contrato : '');
    setClienteId(id_cliente != null ? id_cliente : '');
  } else {
    setFechaFirma('');
    setEstadoContrato('');
    setMontoTotal('');
    setClienteId('');
  }

  setShowAsociar(true);
};


  // Guarda o crea contrato desde modal “Asociar”
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
      const result = selected.contrato?.id_contrato
        ? await actualizarContrato(selected.contrato.id_contrato, datos, token)
        : await crearContrato(datos, token);

      setSubastas(prev =>
        prev.map(s => s.id_subasta === selected.id_subasta
          ? { ...s, contrato: result }
          : s
        )
      );
      setShowAsociar(false);
      alert('Contrato guardado correctamente.');
    } catch (err) {
      console.error(err);
      alert('Error al guardar contrato.');
    }
  };

  // Abre modal “Ver Contratos Asociados”
  const openVer = async sub => {
    setSelected(sub);
    setContratoError('');
    setContratosAsociados([]);
    try {
      const lista = await obtenerContratosPorSubasta(sub.id_subasta, token);
      if (lista.length === 0) {
        setContratoError('No hay contratos asociados a esta subasta.');
      } else {
        setContratosAsociados(lista);
      }
    } catch (err) {
      console.error(err);
      setContratoError('Error al obtener contratos.');
    }
    setShowVer(true);
  };

  if (loading) return <div className="text-center mt-5">Cargando subastas…</div>;

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Listado de Subastas</h2>

      {/* ==== Filtros ==== */}
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

      {/* ==== Tabla de Subastas ==== */}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="thead-dark">
            <tr>
              <th>ID</th><th>Código</th><th>Cantidad</th><th>Tipo</th>
              <th>Estado</th><th>Inicio</th><th>Cierre</th><th>Lugar</th>
              <th>Entregas</th><th>Contrato</th><th>Docs</th>
              <th>Act.Estado</th><th>Acciones</th>
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
                <td>{s.contrato?.contrato || '-'}</td>
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

      {/* ==== Modal Asociar Contrato ==== */}
      {showAsociar && selected && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="delivery-modal">
            <h4>Asociar Contrato a Subasta #{selected.id_subasta}</h4>
            <label>Fecha Firma</label>
            <input
              type="date"
              className="form-control mb-2"
              value={fechaFirma}
              onChange={e => setFechaFirma(e.target.value)}
            />
            <label>Estado</label>
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

      {/* ==== Modal Ver Contratos Asociados ==== */}
      {showVer && selected && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="delivery-modal">
            <h4>Contratos de Subasta #{selected.id_subasta}</h4>

            {contratoError ? (
              <div className="alert alert-danger">{contratoError}</div>
            ) : (
              <div className="table-scroll">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Fecha Firma</th>
                      <th>Estado</th>
                      <th>Monto</th>
                      <th>Cliente</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contratosAsociados.map(c => (
                      <tr key={c.id_contrato}>
                        <td>{c.id_contrato}</td>
                        <td>{new Date(c.fecha_firma).toLocaleDateString()}</td>
                        <td>{c.estado_contrato}</td>
                        <td>S/ {c.monto_total_contrato.toFixed(2)}</td>
                        <td>{c.id_cliente}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
