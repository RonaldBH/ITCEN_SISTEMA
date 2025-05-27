import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ClientesProvider } from './context/ClientesContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RegistroVisitas from './components/RegistroVisitas';
import RegistrarNuevaVisita from './components/RegistrarNuevaVisita';
import ListarVisitasPendientes from './components/ListarVisitasPendientes';
import PrivateRoute from './components/PrivateRoute';

// Este componente tiene que estar dentro del Router
function AppWrapper({ children }) {
  const location = useLocation();

  useEffect(() => {
    const body = document.body;
    if (location.pathname !== '/') {
      body.classList.add('body-with-topbar');
    } else {
      body.classList.remove('body-with-topbar');
    }
  }, [location.pathname]);

  return children;
}

function AppRoutes() {
  return (
    <AppWrapper>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/registro-visitas"
          element={
            <PrivateRoute>
              <RegistroVisitas />
            </PrivateRoute>
          }
        />
        <Route
          path="/registro-visitas/nueva"
          element={
            <PrivateRoute>
              <RegistrarNuevaVisita />
            </PrivateRoute>
          }
        />
        <Route
          path="/registro-visitas/pending"
          element={
            <PrivateRoute>
              <ListarVisitasPendientes />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Login />} />
      </Routes>
    </AppWrapper>
  );
}

function App() {
  return (
    <AuthProvider>
      <ClientesProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ClientesProvider>
    </AuthProvider>
  );
}

export default App;
