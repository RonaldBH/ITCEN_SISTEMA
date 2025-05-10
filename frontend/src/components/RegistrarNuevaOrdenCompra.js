import React, { useState, useContext } from 'react';
import { ClientesContext } from '../context/ClientesContext';
import { registrarOrdenCompra } from '../services/ordenCompraService';
import { useAuth } from '../context/AuthContext';
import '../styles/RegistrarOrdenCompra.css';

const RegistrarNuevaOrdenCompra = () => {
  const [codigoSiga, setCodigoSiga] = useState('');
  const [numeroOrden, setNumeroOrden] = useState('');
  const [tipoContrato, setTipoContrato] = useState('');
  const [tipoCombustible, setTipoCombustible] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [unidadEjecutora, setUnidadEjecutora] = useState('');
  const [lugarEntrega, setLugarEntrega] = useState('');
  const [estado, setEstado] = useState('');
  const [montoTotal, setMontoTotal] = useState('');
  const [fechaEmision, setFechaEmision] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [fechaLimiteEntrega, setFechaLimiteEntrega] = useState('');
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');
  const [numeroContrato, setNumeroContrato] = useState('');
  const [loading, setLoading] = useState(false);

  const { clientes, loading: clientesLoading } = useContext(ClientesContext);
  const { accessToken, user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar campos obligatorios
    if (
      !codigoSiga ||
      !tipoContrato ||
      !cantidad ||
      !unidadEjecutora ||
      !lugarEntrega ||
      !estado ||
      !montoTotal ||
      !fechaEmision ||
      !clienteSeleccionado
    ) {
      alert('Por favor complete todos los campos obligatorios.');
      return;
    }

    if (isNaN(montoTotal) || isNaN(cantidad)) {
      alert('Cantidad y Monto Total deben ser números válidos.');
      return;
    }

    if (!user || !user.id) {
      alert('Usuario no autenticado.');
      return;
    }

    let contratoId = null;
    let tipoCompra = '';

    if (tipoContrato === 'CONTRATO') {
      if (!numeroContrato) {
        alert('Por favor ingrese un número de contrato.');
        return;
      }
      contratoId = numeroContrato;
      tipoCompra = 'Contrato';
    } else if (tipoContrato === 'DIRECTO') {
      contratoId = null;
      tipoCompra = 'Directa';
    }

    setLoading(true);

    try {
      await registrarOrdenCompra(accessToken, {
        codigo_siga: codigoSiga,
        numero_orden: numeroOrden,
        tipo_contrato: tipoContrato,
        tipo_combustible: tipoCombustible,
        cantidad: parseFloat(cantidad),
        unidad_ejecutora: unidadEjecutora,
        lugar_entrega_oc: lugarEntrega,
        estado_oc: estado,
        monto_total_oc: parseFloat(montoTotal),
        fecha_emision_oc: fechaEmision,
        fecha_limite_entrega: fechaLimiteEntrega,
        id_cliente: parseInt(clienteSeleccionado, 10),
        id_contrato: contratoId,
        tipo_compra: tipoCompra,
      });

      alert('Orden registrada correctamente');

      // Resetear campos
      setCodigoSiga('');
      setNumeroOrden('');
      setTipoContrato('');
      setTipoCombustible('');
      setCantidad('');
      setUnidadEjecutora('');
      setLugarEntrega('');
      setEstado('');
      setMontoTotal('');
      setFechaEmision(new Date().toISOString().split('T')[0]);
      setFechaLimiteEntrega('');
      setClienteSeleccionado('');
      setNumeroContrato('');
    } catch (error) {
      alert('Error al registrar la orden');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (clientesLoading) {
    return <div className="text-center mt-5">Cargando clientes...</div>;
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
              onChange={(e) => setCodigoSiga(e.target.value)}
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
              onChange={(e) => setNumeroOrden(e.target.value)}
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
              onChange={(e) => setTipoContrato(e.target.value)}
              required
            >
              <option value="">Selecciona un tipo de contrato</option>
              <option value="CONTRATO">CONTRATO</option>
              <option value="DIRECTO">DIRECTO</option>
            </select>
            <label htmlFor="tipoContrato">Tipo de Contrato</label>
          </div>
        </div>

        {/* Número de Contrato condicional */}
        {tipoContrato === 'CONTRATO' && (
          <div className="col-md-6">
            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                id="numeroContrato"
                value={numeroContrato}
                onChange={(e) => setNumeroContrato(e.target.value)}
                required
              />
              <label htmlFor="numeroContrato">Número de Contrato</label>
            </div>
          </div>
        )}

        {/* Tipo de Combustible */}
        <div className="col-md-6">
          <div className="form-floating">
            <select
              className="form-select"
              id="tipoCombustible"
              value={tipoCombustible}
              onChange={(e) => setTipoCombustible(e.target.value)}
              required
            >
              <option value="">Selecciona</option>
              <option value="DIESEL B5-S50">DIESEL B5-S50</option>
              <option value="GASOHOL REGULAR">GASOHOL REGULAR</option>
              <option value="GASOHOL PREMIUM">GASOHOL PREMIUM</option>
            </select>
            <label htmlFor="tipoCombustible">Tipo de Combustible</label>
          </div>
        </div>

        {/* Cantidad */}
        <div className="col-md-6">
          <div className="form-floating">
            <input
              type="number"
              className="form-control"
              id="cantidad"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              required
            />
            <label htmlFor="cantidad">Cantidad</label>
          </div>
        </div>

        {/* Unidad Ejecutora */}
        <div className="col-md-6">
          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              id="unidadEjecutora"
              value={unidadEjecutora}
              onChange={(e) => setUnidadEjecutora(e.target.value)}
              required
            />
            <label htmlFor="unidadEjecutora">Unidad Ejecutora</label>
          </div>
        </div>

        {/* Lugar de Entrega */}
        <div className="col-md-6">
          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              id="lugarEntrega"
              value={lugarEntrega}
              onChange={(e) => setLugarEntrega(e.target.value)}
              required
            />
            <label htmlFor="lugarEntrega">Lugar de Entrega</label>
          </div>
        </div>

        {/* Estado (SELECT) */}
        <div className="col-md-6">
          <div className="form-floating">
            <select
              className="form-select"
              id="estado"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
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
              onChange={(e) => setMontoTotal(e.target.value)}
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
              onChange={(e) => setFechaEmision(e.target.value)}
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
              onChange={(e) => setFechaLimiteEntrega(e.target.value)}
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
              onChange={(e) => setClienteSeleccionado(e.target.value)}
              required
            >
              <option value="">Selecciona un cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id_cliente} value={cliente.id_cliente}>
                  {cliente.nombre_cliente}
                </option>
              ))}
            </select>
            <label htmlFor="clienteSeleccionado">Cliente</label>
          </div>
        </div>

        {/* Botón */}
        <div className="col-12">
          <button
            type="submit"
            className="btn btn-dark w-100 py-2"
            style={{ borderRadius: '12px' }}
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrar Orden'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrarNuevaOrdenCompra;