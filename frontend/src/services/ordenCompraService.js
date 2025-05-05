// src/services/ordenCompraService.js
import axios from 'axios';

const API_URL = 'https://itcen-sistema.onrender.com/api/v1/ordenes_compra/';

export const obtenerOrdenesCompra = async (token, filtros = {}) => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: filtros, // Puede incluir cliente_id, fecha, etc.
  });
  return response.data;
};

export const registrarOrdenCompra = async (token, datos) => {
  const response = await axios.post(API_URL, datos, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

