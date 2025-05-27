// src/services/entregaService.js
import axios from 'axios';

const API_URL = 'https://itcen-sistema.onrender.com/api/v1/entregas/';

// Obtener entregas
export const obtenerEntregas = async (token, filtros = {}) => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
    params: filtros,
  });
  return response.data;
};

// Crear entrega: firma idéntica a ordenCompraService
export const crearEntrega = async (token, datos) => {
  const response = await axios.post(API_URL, datos, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

// Actualizar entrega
export const actualizarEntrega = async (token, id, datos) => {
  const response = await axios.put(`${API_URL}${id}/`, datos, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};
