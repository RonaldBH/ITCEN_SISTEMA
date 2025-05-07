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
      contratoId = null; // contrato debe ir como null
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
        id_cliente: parseInt(clienteSeleccionado),
        id_contrato: contratoId,
        tipo_compra: tipoCompra
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
      setFechaEmision('');
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

        <div className="col-md-6">
          <div className="form-floating">
            <input type="text" className="form-control" value={codigoSiga} onChange={(e) => setCodigoSiga(e.target.value)} required />
            <label>Código SIGA</label>
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-floating">
            <input type="text" className="form-control" value={numeroOrden} onChange={(e) => setNumeroOrden(e.target.value)} />
            <label>Número de Orden</label>
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-floating">
            <select className="form-select" value={tipoContrato} onChange={(e) => setTipoContrato(e.target.value)} required>
              <option value="">Selecciona un tipo de contrato</option>
              <option value="CONTRATO">CONTRATO</option>
              <option value="DIRECTO">DIRECTO</option>
            </select>
            <label>Tipo de Contrato</label>
          </div>
        </div>

        {tipoContrato === 'CONTRATO' && (
          <div className="col-md-6">
            <div className="form-floating">
              <input type="text" className="form-control" value={numeroContrato} onChange={(e) => setNumeroContrato(e.target.value)} />
              <label>Número de Contrato</label>
            </div>
          </div>
        )}

        <div className="col-md-6">
          <div className="form-floating">
            <select className="form-select" value={tipoCombustible} onChange={(e) => setTipoCombustible(e.target.value)} required>
              <option value="">Selecciona</option>
              <option value="DIESEL B5-S50">DIESEL B5-S50</option>
              <option value="GASOHOL REGULAR">GASOHOL REGULAR</option>
              <option value="GASOHOL PREMIUM">GASOHOL PREMIUM</option>
            </select>
            <label>Tipo de Combustible</label>
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-floating">
            <input type="number" className="form-control" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
            <label>Cantidad</label>
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-floating">
            <input type="text" className="form-control" value={unidadEjecutora} onChange={(e) => setUnidadEjecutora(e.target.value)} />
            <label>Unidad Ejecutora</label>
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-floating">
            <input type="text" className="form-control" value={lugarEntrega} onChange={(e) => setLugarEntrega(e.target.value)} required />
            <label>Lugar de Entrega</label>
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-floating">
            <input type="text" className="form-control" value={estado} onChange={(e) => setEstado(e.target.value)} required />
            <label>Estado</label>
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-floating">
            <input type="number" className="form-control" value={montoTotal} onChange={(e) => setMontoTotal(e.target.value)} required />
            <label>Monto Total</label>
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-floating">
            <input type="date" className="form-control" value={fechaEmision} onChange={(e) => setFechaEmision(e.target.value)} required />
            <label>Fecha de Emisión</label>
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-floating">
            <input type="date" className="form-control" value={fechaLimiteEntrega} onChange={(e) => setFechaLimiteEntrega(e.target.value)} />
            <label>Fecha Límite Entrega</label>
          </div>
        </div>

        <div className="col-12">
          <div className="form-floating">
            <select className="form-select" value={clienteSeleccionado} onChange={(e) => setClienteSeleccionado(e.target.value)} required>
              <option value="">Selecciona un cliente</option>
              {clientes.map(cliente => (
                <option key={cliente.id_cliente} value={cliente.id_cliente}>
                  {cliente.nombre_cliente}
                </option>
              ))}
            </select>
            <label>Cliente</label>
          </div>
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-dark w-100 py-2" style={{ borderRadius: '12px' }} disabled={loading}>
            {loading ? 'Registrando...' : 'Registrar Orden'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default RegistrarNuevaOrdenCompra;
