import axios from 'axios';

const API_URL = 'https://itcen-sistema.onrender.com/api/v1/clientes/';

export const obtenerClientes = async (token, filtros = {}) => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
    params: filtros,
  });
  return response.data;
};

export const registrarCliente = async (token, datos) => {
  const response = await axios.post(API_URL, datos, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const actualizarCliente = async (id, datos, token) => {
  const response = await fetch(`${API_URL}${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar el cliente');
  }

  return await response.json();
};
