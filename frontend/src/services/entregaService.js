// src/services/entregaService.js
import axios from 'axios';

// Base URL configurable vía .env (REACT_APP_API_URL), fallback a localhost
const BASE_URL = process.env.REACT_APP_API_URL || 'https://itcen-sistema.onrender.com';
const ENTREGAS_PATH = '/api/v1/entregas/';
const API_URL = `${BASE_URL}${ENTREGAS_PATH}`;

/**
 * Obtiene la lista de entregas. Permite filtrar por id_orden_compra u otros parámetros.
 * @param {number|string} idOrdenCompra  ID de la orden de compra para filtrar (opcional)
 * @param {string} token  Bearer token de autenticación
 * @returns {Promise<Array>}  Array de objetos entrega
 */
export const obtenerEntregas = async (idOrdenCompra, token) => {
  const params = {};
  if (idOrdenCompra !== undefined && idOrdenCompra !== null) {
    params.id_orden_compra = idOrdenCompra;
  }
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
  return response.data;
};

/**
 * Crea una nueva entrega para una orden de compra.
 * @param {object} data  Datos de la entrega: { fecha_entrega, cantidad_entregada, estado_entrega, id_orden_compra }
 * @param {string} token  Bearer token de autenticación
 * @returns {Promise<object>}  Objeto entrega creado
 */
export const crearEntrega = async (data, token) => {
  const payload = {
    ...data,
    cantidad_entregada: parseFloat(data.cantidad_entregada),
  };
  const response = await axios.post(API_URL, payload, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Actualiza una entrega existente.
 * @param {number|string} idEntrega  ID de la entrega
 * @param {object} data  Campos a actualizar
 * @param {string} token  Bearer token de autenticación
 * @returns {Promise<object>}  Objeto entrega actualizado
 */
export const actualizarEntrega = async (idEntrega, data, token) => {
  const response = await axios.put(`${API_URL}${idEntrega}/`, data, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
