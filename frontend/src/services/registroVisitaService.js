// src/services/registroVisitaService.js
import axios from 'axios';

export const registrarVisita = async (fechaVisita, motivoVisita, resultadoVisita, idUsuario, idCliente, accessToken) => {
  const data = {
    fecha_visita: fechaVisita,
    motivo_visita: motivoVisita,
    resultado_visita: resultadoVisita,
    id_usuario: idUsuario,
    id_cliente: idCliente,
  };

  try {

    /* para el caso del hostlocal 'https://itcen-sistema.onrender.com/api/v1/registros_visitas/' */
    /* para el caso del hostlocal 'http://localhost:8000/api/v1/registros_visitas/' */


    const response = await axios.post('https://itcen-sistema.onrender.com/api/v1/registros_visitas/', data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error al registrar la visita:', error);
    throw error;
  }
};

// Nuevo servicio para listar visitas
export const listarVisitas = async (accessToken) => {
  try {

    /* para el caso del hostlocal 'https://itcen-sistema.onrender.com/api/v1/registros_visitas/' */
    /* para el caso del hostlocal 'http://localhost:8000/api/v1/registros_visitas/' */

    const response = await axios.get('http://localhost:8000/api/v1/registros_visitas/', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al listar visitas:', error);
    throw error;
  }
};
