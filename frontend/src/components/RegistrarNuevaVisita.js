import React, { useState, useContext, useEffect } from 'react';
import { ClientesContext } from '../context/ClientesContext';
import { useAuth } from '../context/AuthContext';
import { registrarVisita } from '../services/registroVisitaService';

const RegistrarNuevaVisita = () => {
  const [fechaVisita, setFechaVisita] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // "YYYY-MM-DD"
  });

  const [motivoVisita, setMotivoVisita] = useState('');
  const [resultadoVisita, setResultadoVisita] = useState('');
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');

  const { clientes, loading } = useContext(ClientesContext);
  const { accessToken, user } = useAuth();

  useEffect(() => {
    if (user) {
      console.log("Usuario autenticado:", user);
    } else {
      console.log("No se encontró el usuario.");
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user || !user.id) {
      alert('No se ha encontrado al usuario, por favor inicie sesión.');
      return;
    }

    registrarVisita(fechaVisita, motivoVisita, resultadoVisita, user.id, clienteSeleccionado, accessToken)
      .then(() => {
        alert('Visita registrada con éxito');
        setFechaVisita('');
        setMotivoVisita('');
        setResultadoVisita('');
        setClienteSeleccionado('');
      })
      .catch((error) => {
        alert(`Error al registrar la visita: ${error.response ? error.response.data.message : error.message}`);
        console.error('Error al registrar la visita:', error);
      });
  };

  if (loading) {
    return <div className="text-center mt-5">Cargando clientes...</div>;
  }

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <div className="card shadow-sm rounded-4 p-4">
        <h2 className="mb-4 text-center" style={{ fontWeight: '600' }}>Registrar Nueva Visita</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="date"
              id="fechaVisita"
              className="form-control"
              value={fechaVisita}
              onChange={(e) => setFechaVisita(e.target.value)}
              required
            />
            <label htmlFor="fechaVisita">Fecha de Visita</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="text"
              id="motivoVisita"
              className="form-control"
              placeholder="Motivo de la visita"
              value={motivoVisita}
              onChange={(e) => setMotivoVisita(e.target.value)}
              required
            />
            <label htmlFor="motivoVisita">Motivo de la Visita</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="text"
              id="resultadoVisita"
              className="form-control"
              placeholder="Resultado de la visita"
              value={resultadoVisita}
              onChange={(e) => setResultadoVisita(e.target.value)}
              required
            />
            <label htmlFor="resultadoVisita">Resultado de la Visita</label>
          </div>

          <div className="form-floating mb-4">
            <select
              id="clienteSeleccionado"
              className="form-select"
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

          <button type="submit" className="btn btn-dark w-100 py-2" style={{ borderRadius: '12px' }}>
            Registrar Visita
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrarNuevaVisita;
