import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import MainContent from '../components/MainContent';
import RegistrarNuevaVisita from '../components/RegistrarNuevaVisita';
import ListarVisitasPendientes from '../components/ListarVisitasPendientes';
import RegistrarNuevaOrdenCompra from '../components/RegistrarNuevaOrdenCompra';
import ListarOrdenesCompra from '../components/ListarOrdenesCompra';
import RegistrarSubasta from '../components/RegistrarSubasta';
import ListarSubastas from '../components/ListarSubastas';
import '../styles/dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [currentContent, setCurrentContent] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="d-flex">
      <Sidebar
        user={user}
        currentContent={currentContent}
        showRegistrarNuevaVisita={() => setCurrentContent('registrarVisita')}
        showListarVisitasPendientes={() => setCurrentContent('listarVisitas')}
        showRegistrarOrdenCompra={() => setCurrentContent('registrarOC')}
        showListarOrdenesCompra={() => setCurrentContent('listarOC')}
        showRegistrarSubasta={() => setCurrentContent('registrarSubasta')}
        showListarSubastas={() => setCurrentContent('listarSubastas')}
        showContenidoPrincipal={() => setCurrentContent('')}
        onLogout={handleLogout}
      />
      <div className="flex-grow-1">
        <Topbar onLogout={handleLogout} user={user} />
        <div className="container mt-4">
          {currentContent === '' && <MainContent />}
          {currentContent === 'registrarVisita' && <RegistrarNuevaVisita />}
          {currentContent === 'listarVisitas' && <ListarVisitasPendientes />}
          {currentContent === 'registrarOC' && <RegistrarNuevaOrdenCompra />}
          {currentContent === 'listarOC' && <ListarOrdenesCompra />}
          {currentContent === 'registrarSubasta' && <RegistrarSubasta />}
          {currentContent === 'listarSubastas' && <ListarSubastas />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

