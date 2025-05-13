// src/pages/Login.js
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { useAuth } from '../context/AuthContext'; // usamos el context
import '../styles/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // obtenemos login del contexto

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(username, password);
  
      if (data.access_token && data.user) {
        login(data.access_token, data.user); // Guardamos el token y el usuario
        navigate('/dashboard');
      } else {
        setError('No se recibió el token o los datos del usuario');
      }
    } catch (err) {
      setError('Credenciales inválidas');
      console.error(err);
    }
  };


  return (
    <div className="login-fullscreen">
      <video autoPlay muted loop className="background-video">
      <source src="/imagenes/fondoanimado2.mp4" type="video/mp4" />
        Tu navegador no soporta la reproducción de video.
      </video>
      <div className="corner-images">
        <img src="/imagenes/logo12.png" alt="Logo ITCEN" className="logo-top-left" />
        <img src="/imagenes/logoDispenzador.png" alt="Retroexcavadora" className="logo-bottom-right" />
      </div>
      <div className="login-box">
        <h2>Iniciar sesión </h2>
        <Form onSubmit={handleSubmit}>
          <div className="input-group">
            <div className="input-with-icon">
              <span className="icon">👤</span>
              <input
                type="text"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="input-group">
            <div className="input-with-icon">
              <span className="icon">🔒</span>
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="btn-wrapper">
            <button type="submit">Entrar</button>
          </div>
        </Form>
        {error && <p className="text-danger">{error}</p>}
      </div>
    </div>
  );
};

export default Login;