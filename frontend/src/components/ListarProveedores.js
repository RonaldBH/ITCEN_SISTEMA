import React, { useState, useEffect } from 'react';
import { obtenerProveedores } from '../services/proveedorServices';
import { useAuth } from '../context/AuthContext';
import { Spinner } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import '../styles/ListarProveedores.css'; // 👈 nuevo archivo CSS

const ListarProveedores = () => {
  const { accessToken } = useAuth();
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const data = await obtenerProveedores(accessToken);
        setProveedores(data);
      } catch (error) {
        console.error('Error al cargar los proveedores:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProveedores();
  }, [accessToken]);

  const exportarExcel = () => {
    if (proveedores.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(proveedores.map(p => ({
      Nombre: p.nombre,
      Dirección: p.direccion,
      RUC: p.ruc_proveedor,
      Teléfono: p.telefono,
      Tipo: p.tipo,
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Proveedores');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'proveedores.xlsx');
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="proveedores-container my-5">
      <div className="proveedores-header">
        <h2 className="proveedores-title">Proveedores Registrados</h2>
        {proveedores.length > 0 && (
          <button className="btn-excel" onClick={exportarExcel}>
            Descargar Excel
          </button>
        )}
      </div>
      {proveedores.length === 0 ? (
        <p className="no-proveedores">No hay proveedores registrados.</p>
      ) : (
        <div className="table-container">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Dirección</th>
                <th>RUC</th>
                <th>Teléfono</th>
                <th>Tipo</th>
              </tr>
            </thead>
            <tbody>
              {proveedores.map((proveedor, index) => (
                <tr key={proveedor.id_proveedor}>
                  <td>{index + 1}</td>
                  <td>{proveedor.nombre}</td>
                  <td>{proveedor.direccion}</td>
                  <td>{proveedor.ruc_proveedor}</td>
                  <td>{proveedor.telefono}</td>
                  <td>{proveedor.tipo || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListarProveedores;
