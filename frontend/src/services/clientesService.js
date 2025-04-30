// src/services/clientesService.js
import axios from 'axios';

export const obtenerClientes = async (token) => {
  const response = await axios.get('https://itcen-sistema.onrender.com/api/v1/clientes/', {
    headers: {
      Authorization: `Bearer ${token}`, // Mandamos el token en el header
    },
  });

  return response.data;
};
