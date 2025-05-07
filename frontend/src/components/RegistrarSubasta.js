import React, { useState } from 'react';
import { registrarSubasta } from '../services/registroSubasta';
import { useAuth } from '../context/AuthContext';
import '../styles/RegistrarSubasta.css'; // Asegúrate de que este archivo esté en el lugar correcto


const RegistrarSubasta = () => {
  const { accessToken } = useAuth();

  const [subasta, setSubasta] = useState({
    codigo_subasta: '',
    cantidad_requerida: '',
    fecha_cierre: '',
    lugar_entrega: '',
    numero_entregas: '',
    tipo_combustible: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubasta((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar campos obligatorios
    const {
      codigo_subasta,
      cantidad_requerida,
      fecha_cierre,
      lugar_entrega,
      numero_entregas,
      tipo_combustible
    } = subasta;

    if (
      !codigo_subasta ||
      !cantidad_requerida ||
      !fecha_cierre ||
      !lugar_entrega ||
      !numero_entregas ||
      !tipo_combustible
    ) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    if (isNaN(cantidad_requerida) || isNaN(numero_entregas)) {
      alert('Cantidad requerida y número de entregas deben ser valores numéricos.');
      return;
    }

    setLoading(true);
    try {
      await registrarSubasta(accessToken, {
        ...subasta,
        cantidad_requerida: parseFloat(cantidad_requerida),
        numero_entregas: parseInt(numero_entregas)
      });

      alert('Subasta registrada correctamente.');

      // Limpiar campos
      setSubasta({
        codigo_subasta: '',
        cantidad_requerida: '',
        fecha_cierre: '',
        lugar_entrega: '',
        numero_entregas: '',
        tipo_combustible: ''
      });

      // Opcional: redireccionar después del registro
      // navigate('/subastas');
    } catch (error) {
      console.error(error);
      alert('Error al registrar la subasta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="subasta-container">
      <h2 className="subasta-title">Registrar Nueva Subasta</h2>
      <form onSubmit={handleSubmit} className="row g-3">

        <div className="col-md-6">
          <div className="form-floating">
            <input
              type="text"
              name="codigo_subasta"
              className="form-control"
              value={subasta.codigo_subasta}
              onChange={handleChange}
              required
            />
            <label>Código de Subasta</label>
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-floating">
            <input
              type="number"
              name="cantidad_requerida"
              className="form-control"
              value={subasta.cantidad_requerida}
              onChange={handleChange}
              required
            />
            <label>Cantidad Requerida</label>
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-floating">
            <input
              type="date"
              name="fecha_cierre"
              className="form-control"
              value={subasta.fecha_cierre}
              onChange={handleChange}
              required
            />
            <label>Fecha de Cierre</label>
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-floating">
            <input
              type="text"
              name="lugar_entrega"
              className="form-control"
              value={subasta.lugar_entrega}
              onChange={handleChange}
              required
            />
            <label>Lugar de Entrega</label>
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-floating">
            <input
              type="number"
              name="numero_entregas"
              className="form-control"
              value={subasta.numero_entregas}
              onChange={handleChange}
              required
            />
            <label>Número de Entregas</label>
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-floating">
            <select
              name="tipo_combustible"
              className="form-select"
              value={subasta.tipo_combustible}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona</option>
              <option value="DIESEL B5-S50">DIESEL B5-S50</option>
              <option value="GASOHOL REGULAR">GASOHOL REGULAR</option>
              <option value="GASOHOL PREMIUM">GASOHOL PREMIUM</option>
            </select>
            <label>Tipo de Combustible</label>
          </div>
        </div>

        <div className="col-12">
          <button
            type="submit"
            className="btn btn-dark w-100 py-2"
            style={{ borderRadius: '12px' }}
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrar Subasta'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrarSubasta;
