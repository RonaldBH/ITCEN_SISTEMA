import React, { useState, useEffect } from 'react';
import { registrarCompra } from '../services/compraServices';
import { obtenerProveedores } from '../services/proveedorServices';
import { useAuth } from '../context/AuthContext';

const RegistrarCompra = () => {
  const { accessToken } = useAuth();
  const [proveedores, setProveedores] = useState([]);
  const [idProveedor, setIdProveedor] = useState('');
  const [fechaCompra, setFechaCompra] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [precioUnitario, setPrecioUnitario] = useState('');
  const [tipoCombustible, setTipoCombustible] = useState('');

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const data = await obtenerProveedores(accessToken);
        setProveedores(data);
      } catch (error) {
        console.error('Error al cargar proveedores:', error);
      }
    };
    fetchProveedores();
  }, [accessToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsedCantidad = parseFloat(cantidad);
      const datos = {
        id_proveedor: parseInt(idProveedor),
        fecha_compra: fechaCompra,
        cantidad: parsedCantidad,
        precio_unitario: parseFloat(precioUnitario),
        stock_restante: parsedCantidad,
        tipo_combustible: tipoCombustible,
      };
      await registrarCompra(accessToken, datos);
      alert('Compra registrada exitosamente');
      setIdProveedor('');
      setFechaCompra('');
      setCantidad('');
      setPrecioUnitario('');
      setTipoCombustible('');
    } catch (error) {
      console.error('Error al registrar la compra:', error);
      alert('Error al registrar la compra');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <div className="card shadow-sm rounded-4 p-4">
        <h2 className="mb-4 text-center" style={{ fontWeight: '600' }}>Registrar Compra</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <select
              className="form-select"
              id="proveedor"
              value={idProveedor}
              onChange={(e) => setIdProveedor(e.target.value)}
              required
            >
              <option value="">Seleccione un proveedor</option>
              {proveedores.map((p) => (
                <option key={p.id_proveedor} value={p.id_proveedor}>
                  {p.nombre} - {p.ruc_proveedor}
                </option>
              ))}
            </select>
            <label htmlFor="proveedor">Proveedor</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="date"
              className="form-control"
              id="fechaCompra"
              value={fechaCompra}
              onChange={(e) => setFechaCompra(e.target.value)}
              required
              placeholder="Fecha de compra"
            />
            <label htmlFor="fechaCompra">Fecha de compra</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="number"
              className="form-control"
              id="cantidad"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              required
              placeholder="Cantidad"
            />
            <label htmlFor="cantidad">Cantidad</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="number"
              className="form-control"
              id="precioUnitario"
              value={precioUnitario}
              onChange={(e) => setPrecioUnitario(e.target.value)}
              required
              placeholder="Precio Unitario"
            />
            <label htmlFor="precioUnitario">Precio Unitario</label>
          </div>

          <div className="form-floating mb-4">
            <select
              className="form-select"
              id="tipoCombustible"
              value={tipoCombustible}
              onChange={(e) => setTipoCombustible(e.target.value)}
              required
            >
              <option value="">Seleccione tipo de combustible</option>
              <option value="GASOHOL REGULAR">GASOHOL REGULAR</option>
              <option value="DIESEL B5 S50">DIESEL B5 S50</option>
              <option value="GASOHOL PREMIUM">GASOHOL PREMIUM</option>
            </select>
            <label htmlFor="tipoCombustible">Tipo de combustible</label>
          </div>

          <button type="submit" className="btn btn-dark w-100 py-2" style={{ borderRadius: '12px' }}>
            Registrar Compra
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrarCompra;
