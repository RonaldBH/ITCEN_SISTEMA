import axios from 'axios';

/* para el caso del hostlocal 'https://itcen-sistema.onrender.com/api/v1/subastas/' */
/* para el caso del hostlocal 'http://localhost:8000/api/v1/subastas/' */

const API_URL = 'https://itcen-sistema.onrender.com/api/v1/subastas/';

// Obtener todas las subastas
export const obtenerSubastas = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener las subastas:', error);
    throw error;
  }
};

// Registrar una nueva subasta
export const registrarSubasta = async (token, datos) => {
  try {
    const response = await axios.post(API_URL, datos, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al registrar la subasta:', error);
    throw error;
  }
};

// Actualizar una subasta
export const actualizarSubasta = async (id, subastaData, token) => {
  try {
    const response = await axios.put(`${API_URL}${id}`, subastaData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el estado de la subasta:', error);
    throw error;
  }
};
