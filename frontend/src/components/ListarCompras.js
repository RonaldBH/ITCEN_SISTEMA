// ListarCompras.jsx
import React, { useState, useEffect } from 'react';
import { obtenerCompras } from '../services/compraServices';
import { useAuth } from '../context/AuthContext';

const ListarCompras = () => {
  const { accessToken } = useAuth();
  const [compras, setCompras] = useState([]);
  const [rucFiltro, setRucFiltro] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const aplicarFiltro = async () => {
    try {
      const filtros = {};
      if (rucFiltro) filtros.ruc_proveedor = rucFiltro;
      if (fechaInicio) filtros.fecha_inicio = fechaInicio;
      if (fechaFin) filtros.fecha_fin = fechaFin;

      const data = await obtenerCompras(accessToken, filtros);
      setCompras(data);
    } catch (error) {
      console.error('Error al obtener compras:', error);
    }
  };

  useEffect(() => {
    const cargarCompras = async () => {
      try {
        const data = await obtenerCompras(accessToken);
        setCompras(data);
      } catch (error) {
        console.error('Error al cargar compras:', error);
      }
    };

    cargarCompras();
  }, [accessToken]);

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow-sm rounded-4">
        <h2 className="mb-4 text-center">Listado de Compras</h2>

        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="RUC del proveedor"
              value={rucFiltro}
              onChange={(e) => setRucFiltro(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <input
              type="date"
              className="form-control"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <input
              type="date"
              className="form-control"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <button onClick={aplicarFiltro} className="btn btn-primary w-100">
              Aplicar Filtro
            </button>
          </div>
        </div>

        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Proveedor</th>
              <th>RUC</th>
              <th>Fecha</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Stock Restante</th>
            </tr>
          </thead>
          <tbody>
            {compras.map((compra) => (
              <tr key={compra.id_compra}>
                <td>{compra.id_compra}</td>
                <td>{compra.proveedor?.nombre || '-'}</td>
                <td>{compra.proveedor?.ruc_proveedor || '-'}</td>
                <td>{new Date(compra.fecha_compra).toLocaleDateString()}</td>
                <td>{compra.cantidad}</td>
                <td>{compra.precio_unitario}</td>
                <td>{compra.stock_restante}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListarCompras;
