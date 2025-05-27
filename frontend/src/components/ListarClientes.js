import React, { useState, useEffect } from 'react';
import { obtenerClientes } from '../services/clienteServices';
import { useAuth } from '../context/AuthContext';
import { Spinner } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import '../styles/ListarClientes.css'; // 👈 importa el nuevo estilo

const ListarClientes = () => {
  const { accessToken } = useAuth();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const data = await obtenerClientes(accessToken);
        setClientes(data);
      } catch (error) {
        console.error('Error al cargar los clientes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, [accessToken]);

  const exportarExcel = () => {
    if (clientes.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(clientes.map(c => ({
      Nombre: c.nombre_cliente,
      Dirección: c.direccion_cliente,
      RUC: c.ruc_cliente,
      Teléfono: c.telefono_cliente
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Clientes');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'clientes.xlsx');
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="clientes-container my-5">
      <div className="clientes-header">
        <h2 className="clientes-title">Clientes Registrados</h2>
        {clientes.length > 0 && (
          <button className="btn-excel" onClick={exportarExcel}>
            Descargar Excel
          </button>
        )}
      </div>
      {clientes.length === 0 ? (
        <p className="no-clientes">No hay clientes registrados.</p>
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
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente, index) => (
                <tr key={cliente.id_cliente}>
                  <td>{index + 1}</td>
                  <td>{cliente.nombre_cliente}</td>
                  <td>{cliente.direccion_cliente}</td>
                  <td>{cliente.ruc_cliente}</td>
                  <td>{cliente.telefono_cliente}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListarClientes;
