// src/services/servicesContrato.js
import axios from 'axios';

// Base URL configurable vía .env, con fallback a localhost
const BASE_URL = process.env.REACT_APP_API_URL || 'https://itcen-sistema.onrender.com';
const CONTRATOS_PATH = '/api/v1/contratos/';
const API_URL = `${BASE_URL}${CONTRATOS_PATH}`;

/**
 * Obtiene un contrato por su ID.
 * @param {number|string} idContrato  ID del contrato
 * @param {string} token             Bearer token de autenticación
 * @returns {Promise<object>}        Objeto contrato
 */
export const obtenerContrato = async (idContrato, token) => {
  const response = await axios.get(`${API_URL}${idContrato}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

/**
 * Crea un nuevo contrato.
 * (Útil si quieres asociar un contrato a una subasta que aún no tiene uno)
 * @param {object} data  Datos del contrato: { numero_contrato, fecha_firma, monto_total_contrato, id_subasta, ... }
 * @param {string} token Bearer token
 * @returns {Promise<object>}  Objeto contrato creado
 */
export const crearContrato = async (data, token) => {
  const response = await axios.post(API_URL, data, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Actualiza un contrato existente.
 * @param {number|string} idContrato  ID del contrato
 * @param {object} data              Campos a actualizar
 * @param {string} token             Bearer token
 * @returns {Promise<object>}        Objeto contrato actualizado
 */
export const actualizarContrato = async (idContrato, data, token) => {
  const response = await axios.put(`${API_URL}${idContrato}/`, data, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
