import React, { useState } from 'react';
import { registrarProveedor } from '../services/proveedorServices';
import { useAuth } from '../context/AuthContext';
import '../styles/RegistrarProveedores.css';

const RegistrarProveedores = () => {
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [ruc, setRuc] = useState('');
  const [telefono, setTelefono] = useState('');
  const [tipoSeleccionado, setTipoSeleccionado] = useState('');
  const [tipoOtro, setTipoOtro] = useState('');
  const { accessToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tipoFinal = tipoSeleccionado === 'OTRO' ? tipoOtro.trim() : tipoSeleccionado;

    const nuevoProveedor = {
      nombre,
      direccion,
      ruc_proveedor: ruc,
      telefono,
      tipo: tipoFinal || null,
    };

    try {
      await registrarProveedor(accessToken, nuevoProveedor);
      alert('Proveedor registrado con éxito');

      // Limpiar campos
      setNombre('');
      setDireccion('');
      setRuc('');
      setTelefono('');
      setTipoSeleccionado('');
      setTipoOtro('');
    } catch (error) {
      console.error('Error al registrar proveedor:', error);
      if (error.response?.data?.detail) {
        alert(`Error: ${error.response.data.detail}`);
      } else {
        alert('Error al registrar proveedor');
      }
    }
  };

  return (
    <div className="proveedor-container">
      <div className="proveedor-card">
        <h2 className="proveedor-title">Registrar Nuevo Proveedor</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-floating proveedor-input">
            <input
              type="text"
              id="nombre"
              className="form-control"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              placeholder="Nombre del proveedor"
            />
            <label htmlFor="nombre">Nombre del Proveedor</label>
          </div>

          <div className="form-floating proveedor-input">
            <input
              type="text"
              id="direccion"
              className="form-control"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Dirección del proveedor"
            />
            <label htmlFor="direccion">Dirección</label>
          </div>

          <div className="form-floating proveedor-input">
            <input
              type="text"
              id="ruc"
              className="form-control"
              value={ruc}
              onChange={(e) => setRuc(e.target.value)}
              required
              placeholder="RUC"
            />
            <label htmlFor="ruc">RUC</label>
          </div>

          <div className="form-floating proveedor-input">
            <input
              type="text"
              id="telefono"
              className="form-control"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Teléfono"
            />
            <label htmlFor="telefono">Teléfono</label>
          </div>

          <div className="form-floating proveedor-input">
            <select
              id="tipo"
              className="form-select"
              value={tipoSeleccionado}
              onChange={(e) => setTipoSeleccionado(e.target.value)}
              required
            >
              <option value="">Seleccionar tipo</option>
              <option value="GRIFO">GRIFO</option>
              <option value="PLANTA">PLANTA</option>
              <option value="OTRO">OTRO</option>
            </select>
            <label htmlFor="tipo">Tipo de Proveedor</label>
          </div>

          {tipoSeleccionado === 'OTRO' && (
            <div className="form-floating proveedor-input">
              <input
                type="text"
                id="tipoOtro"
                className="form-control"
                value={tipoOtro}
                onChange={(e) => setTipoOtro(e.target.value)}
                placeholder="Especificar otro tipo"
                required
              />
              <label htmlFor="tipoOtro">Especificar otro tipo</label>
            </div>
          )}

          <button type="submit" className="proveedor-button">
            Registrar Proveedor
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrarProveedores;
