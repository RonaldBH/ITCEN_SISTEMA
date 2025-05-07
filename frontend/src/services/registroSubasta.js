import axios from 'axios';

const API_URL = 'https://tu-backend/render/api/v1/subastas/';

export const registrarSubasta = async (datos, token) => {
  const response = await axios.post(API_URL, datos, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const obtenerSubastas = async (token) => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
