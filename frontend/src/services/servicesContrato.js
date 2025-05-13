import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'https://itcen-sistema.onrender.com';
const CONTRATOS_PATH = '/api/v1/contratos/';
const API_URL = `${BASE_URL}${CONTRATOS_PATH}`;

// headers reutilizables
const authHeaders = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

export const obtenerContrato = async (idContrato, token) => {
  const res = await axios.get(`${API_URL}${idContrato}/`, {
    headers: authHeaders(token),
  });
  return res.data;
};

export const crearContrato = async (data, token) => {
  const res = await axios.post(API_URL, data, {
    headers: authHeaders(token),
  });
  return res.data;
};

export const actualizarContrato = async (idContrato, data, token) => {
  const res = await axios.put(`${API_URL}${idContrato}/`, data, {
    headers: authHeaders(token),
  });
  return res.data;
};

/**
 * Nuevo: obtiene todos los contratos de una subasta
 * GET /api/v1/contratos? id_subasta=123
 */
export const obtenerContratosPorSubasta = async (idSubasta, token) => {
  const res = await axios.get(API_URL, {
    params: { id_subasta: idSubasta },
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // array de contratos
};
