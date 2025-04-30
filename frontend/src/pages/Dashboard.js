import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import MainContent from '../components/MainContent';
import RegistrarNuevaVisita from '../components/RegistrarNuevaVisita'; // Componente para registrar nueva visita
import ListarVisitasPendientes from '../components/ListarVisitasPendientes'; // Componente para listar visitas pendientes
import '../styles/dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [currentContent, setCurrentContent] = useState(''); // Estado para manejar qué contenido mostrar

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const showRegistrarNuevaVisita = () => setCurrentContent('registrar'); // Cambiar a Registrar nueva visita
  const showListarVisitasPendientes = () => setCurrentContent('listar'); // Cambiar a Listar visitas pendientes
  const showContenidoPrincipal = () => setCurrentContent('');


  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="d-flex">
      <Sidebar user={user} 
               showRegistrarNuevaVisita={showRegistrarNuevaVisita}
               showListarVisitasPendientes={showListarVisitasPendientes}
               showContenidoPrincipal={showContenidoPrincipal}
               onLogout={handleLogout} />
      <div className="flex-grow-1">
        <Topbar onLogout={handleLogout} user={user} />
        <div className="container">
          {currentContent === 'registrar' && <RegistrarNuevaVisita />}
          {currentContent === 'listar' && <ListarVisitasPendientes />}
          {currentContent === '' && <MainContent />} {/* Por defecto, mostrar el contenido principal */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


