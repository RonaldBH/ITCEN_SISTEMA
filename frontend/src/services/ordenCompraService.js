// src/services/ordenCompraService.js
import axios from 'axios';

  /* para el caso del hostlocal 'https://itcen-sistema.onrender.com/api/v1/orden_compra/' */
  /* para el caso del hostlocal 'http://localhost:8000/api/v1/ordenes_compra/' */

const API_URL = 'https://itcen-sistema.onrender.com/api/v1/orden_compra/';

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

export const actualizarOrdenCompra = async (id, datos, token) => {
  const response = await fetch(`${API_URL}${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar la orden de compra');
  }

  return await response.json();
};
