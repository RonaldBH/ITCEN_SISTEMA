// src/services/clientesService.js
import axios from 'axios';

export const obtenerClientes = async (token) => {
  /* para el caso del hostlocal 'http://localhost:8000/api/v1/clientes/' */

  const response = await axios.get('http://localhost:8000/api/v1/clientes/', {
    headers: {
      Authorization: `Bearer ${token}`, // Mandamos el token en el header
    },
  });

  return response.data;
};
