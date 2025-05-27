// src/services/guiaService.js
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'https://itcen-sistema.onrender.com';
const GUIAS_PATH = '/api/v1/guia_remision/';
const API_URL = `${BASE_URL}${GUIAS_PATH}`;

/**
 * Emite una guía de remisión (la guarda y la envía a SUNAT vía Nubefact).
 * @param {object} data Datos de la guía de remisión
 * @param {string} token Token de autenticación (Bearer)
 * @returns {Promise<object>} Respuesta con { guia, nubefact_respuesta }
 */
export const emitirGuiaRemisionNubefact = async (data, token) => {
  try {
    const response = await axios.post(API_URL, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Error al emitir guía de remisión' };
  }
};
