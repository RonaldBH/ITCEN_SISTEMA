import React, { createContext, useState, useEffect } from 'react';
import { obtenerClientes } from '../services/clientesService'; 
import { useAuth } from './AuthContext'; // Importamos el hook useAuth

export const ClientesContext = createContext();

export const ClientesProvider = ({ children }) => {
  const { accessToken } = useAuth(); // Tomamos el accessToken del AuthContext
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (accessToken) { // Solo llamar si hay token
      obtenerClientes(accessToken)
        .then((data) => {
          setClientes(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error al obtener los clientes:', error);
          setLoading(false);
        });
    }
  }, [accessToken]); //Ahora depende de accessToken

  return (
    <ClientesContext.Provider value={{ clientes, loading }}>
      {children}
    </ClientesContext.Provider>
  );
};