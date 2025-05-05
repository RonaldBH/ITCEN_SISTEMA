import React, { useState, useContext } from 'react';
import { ClientesContext } from '../context/ClientesContext';
import { registrarOrdenCompra } from '../services/ordenCompraService';
import { useAuth } from '../context/AuthContext';

const RegistrarNuevaOrdenCompra = () => {
  const [codigoSiga, setCodigoSiga] = useState('');
  const [numeroOrden, setNumeroOrden] = useState('');
  const [tipoCompra, setTipoCompra] = useState('');
  const [tipoContrato, setTipoContrato] = useState('');
  const [tipoCombustible, setTipoCombustible] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [unidadEjecutora, setUnidadEjecutora] = useState('');
  const [lugarEntrega, setLugarEntrega] = useState('');
  const [estado, setEstado] = useState('');
  const [montoTotal, setMontoTotal] = useState('');
  const [fechaEmision, setFechaEmision] = useState('');
  const [fechaLimiteEntrega, setFechaLimiteEntrega] = useState('');
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');

  const { clientes, loading } = useContext(ClientesContext);
  const { accessToken, user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.id) {
      alert('Usuario no autenticado.');
      return;
    }

    try {
      await registrarOrdenCompra(accessToken, {
        codigo_siga: codigoSiga,
        numero_orden: numeroOrden,
        tipo_compra: tipoCompra,
        tipo_contrato: tipoContrato,
        tipo_combustible: tipoCombustible,
        cantidad: cantidad,
        unidad_ejecutora: unidadEjecutora,
        lugar_entrega_oc: lugarEntrega,
        estado_oc: estado,
        monto_total_oc: montoTotal,
        fecha_emision_oc: fechaEmision,
        fecha_limite_entrega: fechaLimiteEntrega,
        id_cliente: clienteSeleccionado,
        id_contrato: 1, // A futuro puedes hacer esto dinámico
      });
      
      alert('Orden registrada correctamente');

      setCodigoSiga('');
      setNumeroOrden('');
      setTipoCompra('');
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
    } catch (error) {
      alert('Error al registrar la orden');
      console.error(error);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Cargando clientes...</div>;
  }

  return (
    <div className="container mt-5" style={{ maxWidth: '800px' }}>
      <div className="card shadow-sm rounded-4 p-4">
        <h2 className="mb-4 text-center fw-bold">Registrar Nueva Orden de Compra</h2>
        <form onSubmit={handleSubmit}>

          <div className="row g-3">
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
                <select className="form-select" value={tipoCompra} onChange={(e) => setTipoCompra(e.target.value)} required>
                  <option value="">Selecciona</option>
                  <option value="Consumible">Consumible</option>
                  <option value="Otro">Otro</option>
                </select>
                <label>Tipo de Compra</label>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-floating">
                <input type="text" className="form-control" value={tipoContrato} onChange={(e) => setTipoContrato(e.target.value)} />
                <label>Tipo de Contrato</label>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-floating">
                <input type="text" className="form-control" value={tipoCombustible} onChange={(e) => setTipoCombustible(e.target.value)} />
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
          </div>

          <button type="submit" className="btn btn-dark w-100 mt-4 py-2 rounded-3">
            Registrar Orden
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrarNuevaOrdenCompra;
