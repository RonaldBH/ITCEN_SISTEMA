import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registrarSubasta } from '../services/registroSubasta';
import { useAuth } from '../context/AuthContext';
import '../styles/RegistrarSubasta.css';

const RegistrarSubasta = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [subasta, setSubasta] = useState({
    codigo_subasta: '',
    cantidad_requerida: '',
    fecha_cierre: '',
    lugar_entrega: '',
    numero_entregas: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubasta({ ...subasta, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registrarSubasta(subasta, token);
      navigate('/subastas');
    } catch (error) {
      console.error('Error al registrar subasta:', error);
    }
  };

  return (
    <div className="registro-subasta-container">
      <h2 className="registro-subasta-title">Registrar Nueva Subasta</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="codigo_subasta" className="form-label">Código Subasta</label>
          <input
            type="text"
            id="codigo_subasta"
            name="codigo_subasta"
            value={subasta.codigo_subasta}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cantidad_requerida" className="form-label">Cantidad Requerida</label>
          <input
            type="number"
            id="cantidad_requerida"
            name="cantidad_requerida"
            value={subasta.cantidad_requerida}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="fecha_cierre" className="form-label">Fecha de Cierre</label>
          <input
            type="date"
            id="fecha_cierre"
            name="fecha_cierre"
            value={subasta.fecha_cierre}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="lugar_entrega" className="form-label">Lugar de Entrega</label>
          <input
            type="text"
            id="lugar_entrega"
            name="lugar_entrega"
            value={subasta.lugar_entrega}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="numero_entregas" className="form-label">Número de Entregas</label>
          <input
            type="number"
            id="numero_entregas"
            name="numero_entregas"
            value={subasta.numero_entregas}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <button type="submit">Registrar Subasta</button>
      </form>
    </div>
  );
};

export default RegistrarSubasta;
