import axios from 'axios';

const API_URL = 'https://itcen-sistema.onrender.com/api/v1/proveedor/';

export const obtenerProveedores = async (token, filtros = {}) => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
    params: filtros,
  });
  return response.data;
};

export const registrarProveedor = async (token, datos) => {
  const response = await axios.post(API_URL, datos, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const actualizarProveedor = async (id, datos, token) => {
  const response = await fetch(`${API_URL}${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar el proveedor');
  }

  return await response.json();
};
