import React, { useState } from 'react';
import { registrarCliente } from '../services/clienteServices';
import { useAuth } from '../context/AuthContext';
import '../styles/RegistrarClientes.css'; // 👈 Importa el CSS

const RegistrarClientes = () => {
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [ruc, setRuc] = useState('');
  const [telefono, setTelefono] = useState('');
  const { accessToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nuevoCliente = {
      nombre_cliente: nombre,
      direccion_cliente: direccion,
      ruc_cliente: ruc,
      telefono_cliente: telefono,
    };

    try {
      await registrarCliente(accessToken, nuevoCliente);
      alert('Cliente registrado con éxito');
      setNombre('');
      setDireccion('');
      setRuc('');
      setTelefono('');
    } catch (error) {
      console.error('Error al registrar cliente:', error);
      alert('Error al registrar cliente');
    }
  };

  return (
    <div className="subasta-container">
      <h2 className="subasta-title">Registrar Nuevo Cliente</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            placeholder="Nombre del cliente"
          />
          <label htmlFor="nombre">Nombre del Cliente</label>
        </div>

        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            id="direccion"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            required
            placeholder="Dirección del cliente"
          />
          <label htmlFor="direccion">Dirección</label>
        </div>

        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            id="ruc"
            value={ruc}
            onChange={(e) => setRuc(e.target.value)}
            required
            placeholder="RUC"
          />
          <label htmlFor="ruc">RUC</label>
        </div>

        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            id="telefono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
            placeholder="Teléfono"
          />
          <label htmlFor="telefono">Teléfono</label>
        </div>

        <button type="submit" className="subasta-button">
          Registrar Cliente
        </button>
      </form>
    </div>
  );
};

export default RegistrarClientes;
