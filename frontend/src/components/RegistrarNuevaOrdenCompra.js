// src/components/RegistrarNuevaOrdenCompra.jsx

import React, { useState, useContext } from 'react';
import { ClientesContext } from '../context/ClientesContext';
import { registrarOrdenCompra } from '../services/ordenCompraService';
import { useAuth } from '../context/AuthContext';
import '../styles/RegistrarOrdenCompra.css';

const RegistrarNuevaOrdenCompra = () => {
  const { clientes, loading: clientesLoading } = useContext(ClientesContext);
  const { accessToken, user } = useAuth();

  // Campos de cabecera de la orden
  const [codigoSiga, setCodigoSiga] = useState('');
  const [numeroOrden, setNumeroOrden] = useState('');
  const [tipoContrato, setTipoContrato] = useState('');
  const [numeroContrato, setNumeroContrato] = useState('');
  const [lugarEntrega, setLugarEntrega] = useState('');
  const [estado, setEstado] = useState('');
  const [montoTotal, setMontoTotal] = useState('');
  const [fechaEmision, setFechaEmision] = useState(() => new Date().toISOString().split('T')[0]);
  const [fechaLimiteEntrega, setFechaLimiteEntrega] = useState('');
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');

  // Lista dinámica de ítems
  const [items, setItems] = useState([
    { tipo_combustible: '', cantidad: '', unidad: 'GLL', precio_unitario: '' },
  ]);

  const [loading, setLoading] = useState(false);

  const agregarItem = () => {
    setItems(prev => [
      ...prev,
      { tipo_combustible: '', cantidad: '', unidad: 'GLL', precio_unitario: '' },
    ]);
  };

  const eliminarItem = index => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const actualizarItem = (index, field, value) => {
    setItems(prev => {
      const copia = [...prev];
      copia[index][field] = value;
      return copia;
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    // Validaciones de cabecera
    if (
      !codigoSiga ||
      !tipoContrato ||
      !lugarEntrega ||
      !estado ||
      !montoTotal ||
      !fechaEmision ||
      !clienteSeleccionado
    ) {
      return alert('Completa todos los campos obligatorios de la orden.');
    }
    // Validación ítems
    if (items.length === 0) {
      return alert('Agrega al menos un ítem.');
    }
    for (const it of items) {
      if (!it.tipo_combustible || !it.cantidad || !it.precio_unitario) {
        return alert('Completa todos los campos de cada ítem.');
      }
    }
    if (!user?.id) {
      return alert('Usuario no autenticado.');
    }

    const payload = {
      codigo_siga: codigoSiga,
      numero_orden: numeroOrden,
      tipo_compra: tipoContrato === 'CONTRATO' ? 'Contrato' : 'Directa',
      id_contrato: tipoContrato === 'CONTRATO' ? numeroContrato : null,
      lugar_entrega_oc: lugarEntrega,
      estado_oc: estado,
      monto_total_oc: parseFloat(montoTotal),
      fecha_emision_oc: fechaEmision,
      fecha_limite_entrega: fechaLimiteEntrega || undefined,
      id_cliente: parseInt(clienteSeleccionado, 10),
      items: items.map(it => ({
        tipo_combustible: it.tipo_combustible,
        cantidad: parseFloat(it.cantidad),
        unidad_medida: it.unidad,
        precio_unitario: parseFloat(it.precio_unitario),
      })),
    };

    setLoading(true);
    try {
      await registrarOrdenCompra(accessToken, payload);
      alert('Orden registrada correctamente');
      // Reset campos
      setCodigoSiga('');
      setNumeroOrden('');
      setTipoContrato('');
      setNumeroContrato('');
      setLugarEntrega('');
      setEstado('');
      setMontoTotal('');
      setFechaEmision(new Date().toISOString().split('T')[0]);
      setFechaLimiteEntrega('');
      setClienteSeleccionado('');
      setItems([{ tipo_combustible: '', cantidad: '', unidad: 'GLL', precio_unitario: '' }]);
    } catch (err) {
      console.error(err);
      alert('Error al registrar la orden');
    } finally {
      setLoading(false);
    }
  };

  if (clientesLoading) {
    return <div className="text-center mt-5">Cargando clientes…</div>;
  }

  return (
    <div className="ordenes-container">
      <h2 className="ordenes-title">Registrar Nueva Orden de Compra</h2>
      <form onSubmit={handleSubmit} className="row g-3">
        {/* Código SIGA */}
        <div className="col-md-6">
          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              id="codigoSiga"
              value={codigoSiga}
              onChange={e => setCodigoSiga(e.target.value)}
              required
            />
            <label htmlFor="codigoSiga">Código SIGA</label>
          </div>
        </div>

        {/* Número de Orden */}
        <div className="col-md-6">
          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              id="numeroOrden"
              value={numeroOrden}
              onChange={e => setNumeroOrden(e.target.value)}
            />
            <label htmlFor="numeroOrden">Número de Orden</label>
          </div>
        </div>

        {/* Tipo de Contrato */}
        <div className="col-md-6">
          <div className="form-floating">
            <select
              className="form-select"
              id="tipoContrato"
              value={tipoContrato}
              onChange={e => setTipoContrato(e.target.value)}
              required
            >
              <option value="">Selecciona un tipo de contrato</option>
              <option value="CONTRATO">CONTRATO</option>
              <option value="DIRECTO">DIRECTO</option>
            </select>
            <label htmlFor="tipoContrato">Tipo de Contrato</label>
          </div>
        </div>

        {/* Número de Contrato (condicional) */}
        {tipoContrato === 'CONTRATO' && (
          <div className="col-md-6">
            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                id="numeroContrato"
                value={numeroContrato}
                onChange={e => setNumeroContrato(e.target.value)}
                required
              />
              <label htmlFor="numeroContrato">Número de Contrato</label>
            </div>
          </div>
        )}

        {/* Lugar de Entrega */}
        <div className="col-md-6">
          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              id="lugarEntrega"
              value={lugarEntrega}
              onChange={e => setLugarEntrega(e.target.value)}
              required
            />
            <label htmlFor="lugarEntrega">Lugar de Entrega</label>
          </div>
        </div>

        {/* Estado */}
        <div className="col-md-6">
          <div className="form-floating">
            <select
              className="form-select"
              id="estado"
              value={estado}
              onChange={e => setEstado(e.target.value)}
              required
            >
              <option value="">Selecciona un estado</option>
              <option value="Pendiente">Pendiente</option>
              <option value="En Camino">En Camino</option>
              <option value="Entregada">Entregada</option>
              <option value="Cancelada">Cancelada</option>
            </select>
            <label htmlFor="estado">Estado</label>
          </div>
        </div>

        {/* Monto Total */}
        <div className="col-md-6">
          <div className="form-floating">
            <input
              type="number"
              className="form-control"
              id="montoTotal"
              value={montoTotal}
              onChange={e => setMontoTotal(e.target.value)}
              required
            />
            <label htmlFor="montoTotal">Monto Total</label>
          </div>
        </div>

        {/* Fecha de Emisión */}
        <div className="col-md-6">
          <div className="form-floating">
            <input
              type="date"
              className="form-control"
              id="fechaEmision"
              value={fechaEmision}
              onChange={e => setFechaEmision(e.target.value)}
              required
            />
            <label htmlFor="fechaEmision">Fecha de Emisión</label>
          </div>
        </div>

        {/* Fecha Límite Entrega */}
        <div className="col-md-6">
          <div className="form-floating">
            <input
              type="date"
              className="form-control"
              id="fechaLimiteEntrega"
              value={fechaLimiteEntrega}
              onChange={e => setFechaLimiteEntrega(e.target.value)}
            />
            <label htmlFor="fechaLimiteEntrega">Fecha Límite Entrega</label>
          </div>
        </div>

        {/* Cliente */}
        <div className="col-12">
          <div className="form-floating">
            <select
              className="form-select"
              id="clienteSeleccionado"
              value={clienteSeleccionado}
              onChange={e => setClienteSeleccionado(e.target.value)}
              required
            >
              <option value="">Selecciona un cliente</option>
              {clientes.map(c => (
                <option key={c.id_cliente} value={c.id_cliente}>
                  {c.nombre_cliente}
                </option>
              ))}
            </select>
            <label htmlFor="clienteSeleccionado">Cliente</label>
          </div>
        </div>

        {/* Sección Ítems Dinámicos */}
        <div className="col-12"><h5>Ítems de la Orden</h5></div>
        {items.map((item, idx) => (
          <React.Fragment key={idx}>
            {/* Tipo de combustible */}
            <div className="col-md-3">
              <select
                className="form-select"
                value={item.tipo_combustible}
                onChange={e => actualizarItem(idx, 'tipo_combustible', e.target.value)}
                required
              >
                <option value="">Combustible</option>
                <option value="DIESEL B5-S50">DIESEL B5-S50</option>
                <option value="GASOHOL REGULAR">GASOHOL REGULAR</option>
                <option value="GASOHOL PREMIUM">GASOHOL PREMIUM</option>
              </select>
            </div>
            {/* Cantidad */}
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                placeholder="Cantidad"
                value={item.cantidad}
                onChange={e => actualizarItem(idx, 'cantidad', e.target.value)}
                required
              />
            </div>
            {/* Unidad (siempre Galón US) */}
            <div className="col-md-2">
              <input
                type="text"
                className="form-control"
                value={item.unidad}
                readOnly
              />
            </div>
            {/* Precio Unitario */}
            <div className="col-md-3">
              <input
                type="number"
                className="form-control"
                placeholder="Precio Unitario"
                value={item.precio_unitario}
                onChange={e => actualizarItem(idx, 'precio_unitario', e.target.value)}
                required
              />
            </div>
            {/* Botón Eliminar */}
            <div className="col-md-2 d-flex align-items-center">
              <button
                type="button"
                className="btn btn-danger w-100"
                onClick={() => eliminarItem(idx)}
                disabled={items.length === 1}
              >
                Eliminar
              </button>
            </div>
          </React.Fragment>
        ))}

        <div className="col-12 text-end">
          <button type="button" className="btn btn-secondary" onClick={agregarItem}>
            + Agregar Ítem
          </button>
        </div>

        {/* Botón Registrar */}
        <div className="col-12">
          <button type="submit" className="btn btn-dark w-100 py-2" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrar Orden'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrarNuevaOrdenCompra;
