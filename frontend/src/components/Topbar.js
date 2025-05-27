import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { obtenerUsuarioPorId, actualizarUsuario } from '../services/usuarioService';
import '../styles/Topbar.css';

const Topbar = () => {
  const { user, logout, accessToken } = useAuth();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [usuarioInfo, setUsuarioInfo] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ nombre_usuario: '', correo_usuario: '', telefono_usuario: '' });

  const handleLanguageChange = (language) => {
    console.log(`Idioma seleccionado: ${language}`);
    setShowLanguageMenu(false);
  };

  const handleLogout = () => {
    logout();
    setShowUserModal(false);
  };

  const toggleLanguageMenu = () => {
    setShowLanguageMenu(!showLanguageMenu);
    setShowUserModal(false);
  };

  const toggleUserModal = () => {
    setShowUserModal(!showUserModal);
    setShowLanguageMenu(false);
  };

  useEffect(() => {
    const cargarUsuario = async () => {
      if (user?.id && accessToken) {
        try {
          const data = await obtenerUsuarioPorId(user.id, accessToken);
          setUsuarioInfo(data);
          setFormData({
            nombre_usuario: data?.nombre_usuario || '',
            correo_usuario: data?.correo_usuario || '',
            telefono_usuario: data?.telefono_usuario || '',
          });
        } catch (error) {
          console.error('Error al cargar datos del usuario:', error);
        }
      }
    };

    if (showUserModal) {
      cargarUsuario();
    }
  }, [showUserModal, user, accessToken]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardarCambios = async () => {
    try {
      const actualizado = await actualizarUsuario(user.id, formData, accessToken);
      setUsuarioInfo(actualizado);
      setEditMode(false);
    } catch (error) {
      console.error('Error al actualizar datos del usuario:', error);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand navbar-light bg-white shadow-sm mb-4 px-3 topbar-navbar">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <form className="d-flex align-items-center" role="search">
            <input
              className="form-control me-2 rounded-pill shadow-sm"
              type="search"
              placeholder="Buscar..."
              aria-label="Buscar"
              style={{ maxWidth: '250px' }}
            />
            <button className="btn btn-outline-primary rounded-pill shadow-sm" type="submit">
              Buscar
            </button>
          </form>
          {/* Título centrado y estilizado */}
          <div className="flex-grow-1 text-center">
            <h5 className="app-title">ITCEN CONTRATISTAS Y ASOCIADOS S.A.C</h5>
          </div>
          <div className="d-flex align-items-center gap-3">
            <div className="dropdown-wrapper">
              <button className="icon-btn" title="Idioma" onClick={toggleLanguageMenu}>
                <i className="bi bi-gear fs-5"></i>
              </button>
              {showLanguageMenu && (
                <div className="dropdown-menu-custom">
                  <button onClick={() => handleLanguageChange('Español')}>Español</button>
                  <button onClick={() => handleLanguageChange('Inglés')}>Inglés</button>
                  <button onClick={() => handleLanguageChange('Portugués')}>Portugués</button>
                </div>
              )}
            </div>

            <button className="icon-btn" title="Perfil" onClick={toggleUserModal}>
              <i className="bi bi-person-circle fs-5"></i>
            </button>
          </div>
        </div>
      </nav>

      {showUserModal && (
        <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
          <div className="user-modal elegant-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">👤 Mi Perfil</h3>

            <div className="user-info">
              {editMode ? (
                <>
                  <div className="mb-2">
                    <label><strong>Nombre:</strong></label>
                    <input className="form-control" name="nombre_usuario" value={formData.nombre_usuario} onChange={handleInputChange} />
                  </div>
                  <div className="mb-2">
                    <label><strong>Correo:</strong></label>
                    <input className="form-control" name="correo_usuario" value={formData.correo_usuario} onChange={handleInputChange} />
                  </div>
                  <div className="mb-2">
                    <label><strong>Teléfono:</strong></label>
                    <input className="form-control" name="telefono_usuario" value={formData.telefono_usuario} onChange={handleInputChange} />
                  </div>
                </>
              ) : (
                <>
                  <p><strong>Nombre:</strong> {usuarioInfo?.nombre_usuario || user?.nombre_usuario || 'No disponible'}</p>
                  <p><strong>Correo:</strong> {usuarioInfo?.correo_usuario || user?.correo_usuario || 'No disponible'}</p>
                  <p><strong>Teléfono:</strong> {usuarioInfo?.telefono_usuario || 'No disponible'}</p>
                  <p><strong>Cargo:</strong> {usuarioInfo?.cargo_usuario || user?.cargo_usuario || 'No disponible'}</p>
                </>
              )}
            </div>

            <div className="modal-buttons">
              {editMode ? (
                <>
                  <button className="btn btn-success me-2" onClick={handleGuardarCambios}>Guardar</button>
                  <button className="btn btn-secondary" onClick={() => setEditMode(false)}>Cancelar</button>
                </>
              ) : (
                <>
                  <button className="btn btn-light me-2" onClick={() => setEditMode(true)}>Editar</button>
                  <button className="btn btn-light me-2" onClick={() => setShowUserModal(false)}>Cerrar</button>
                  <button className="btn btn-dark" onClick={handleLogout}>Cerrar Sesión</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Topbar;
