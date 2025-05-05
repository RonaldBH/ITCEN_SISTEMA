import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import MainContent from '../components/MainContent';
import RegistrarNuevaVisita from '../components/RegistrarNuevaVisita';
import ListarVisitasPendientes from '../components/ListarVisitasPendientes';
import ListarOrdenesCompra from '../components/ListarOrdenesCompra'; // Nuevo componente para Listar OC
import '../styles/dashboard.css';
import RegistrarNuevaOrdenCompra from '../components/RegistrarNuevaOrdenCompra';

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [currentContent, setCurrentContent] = useState(''); // Estado para manejar qué contenido mostrar

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const showRegistrarNuevaVisita = () => setCurrentContent('registrarVisita'); // Mostrar Registrar nueva visita
  const showListarVisitasPendientes = () => setCurrentContent('listarVisitas'); // Mostrar Listar visitas pendientes
  const showRegistrarOrdenCompra = () => setCurrentContent('registrarOC'); // Mostrar Registrar nueva orden de compra
  const showListarOrdenesCompra = () => setCurrentContent('listarOC'); // Mostrar Listar órdenes de compra
  const showContenidoPrincipal = () => setCurrentContent(''); // Mostrar contenido principal

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="d-flex">
      <Sidebar 
        user={user}
        showRegistrarNuevaVisita={showRegistrarNuevaVisita}
        showListarVisitasPendientes={showListarVisitasPendientes}
        showRegistrarOrdenCompra={showRegistrarOrdenCompra} // Pasar nueva función
        showListarOrdenesCompra={showListarOrdenesCompra} // Pasar nueva función
        showContenidoPrincipal={showContenidoPrincipal}
        onLogout={handleLogout} 
      />
      <div className="flex-grow-1">
        <Topbar onLogout={handleLogout} user={user} />
        <div className="container mt-4">
          {currentContent === 'registrarVisita' && <RegistrarNuevaVisita />}
          {currentContent === 'listarVisitas' && <ListarVisitasPendientes />}
          {currentContent === 'registrarOC' && <RegistrarNuevaOrdenCompra />} {/* Mostrar Registrar OC */}
          {currentContent === 'listarOC' && <ListarOrdenesCompra />} {/* Mostrar Listar OC */}
          {currentContent === '' && <MainContent />} {/* Por defecto, mostrar el contenido principal */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


