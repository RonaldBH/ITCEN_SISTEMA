import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ClientesProvider } from './context/ClientesContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RegistroVisitas from './components/RegistroVisitas';
import RegistrarNuevaVisita from './components/RegistrarNuevaVisita';
import ListarVisitasPendientes from './components/ListarVisitasPendientes';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <ClientesProvider> {/* Envuelve el Router en ClientesProvider */}
        <Router>
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
        </Router>
      </ClientesProvider>
    </AuthProvider>
  );
}

export default App;

