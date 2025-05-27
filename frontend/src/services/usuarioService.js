// services/usuarioService.js
import axios from 'axios';

const API_URL = 'https://itcen-sistema.onrender.com/api/v1/usuario/';

// Obtener lista de usuarios (con filtros opcionales)
export const obtenerUsuarios = async (token, filtros = {}) => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
    params: filtros,
  });
  return response.data;
};

// Registrar un nuevo usuario
export const registrarUsuario = async (token, datos) => {
  const response = await axios.post(API_URL, datos, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

// Actualizar un usuario existente
export const actualizarUsuario = async (id, datos, token) => {
  const response = await fetch(`${API_URL}${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar el usuario');
  }

  return await response.json();
};

// Obtener un usuario por ID
export const obtenerUsuarioPorId = async (id, token) => {
  const response = await axios.get(`${API_URL}${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
