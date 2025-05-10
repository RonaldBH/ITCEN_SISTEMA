import { useEffect, useRef, useState } from 'react';
import { MoreVertical } from 'lucide-react';

const BotonAcciones = ({ orden, manejarGenerarEntrega, manejarVerEntregas }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Cierra el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const btnStyle = {
    padding: 6,
    borderRadius: '9999px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  };

  const iconStyle = {
    width: 20,
    height: 20,
    color: '#6B7280', // gris medio
    transform: open ? 'rotate(90deg)' : 'rotate(0)',
    transition: 'transform 0.2s',
  };

const dropdownStyle = {
  position: 'absolute',
  bottom: 'calc(100% + 6px)',
  left: '-50%',
  transform: 'translateX(-50%)',
  backgroundColor: 'transparent',
  borderRadius: 8,
  boxShadow: 'none',
  zIndex: 1000,
  display: open ? 'flex' : 'none',
  flexDirection: 'column',
  padding: 2, // reducido
};


const itemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '6px 8px', // menos espacio que antes
  fontSize: 14,
  color: '#374151',
  background: '#FFFFFF',
  border: 'none',
  borderRadius: 6,
  textAlign: 'center',
  cursor: 'pointer',
  fontWeight: 'bold',
  transition: 'background-color 0.2s, color 0.2s',
};


  const hoverStyle = {
    backgroundColor: '#F3F4F6', // Cambio de color de fondo al pasar el cursor
    color: '#1D4ED8', // Color del texto al pasar el cursor
  };

  const handleHover = (e, hover) => {
    e.currentTarget.style.backgroundColor = hover ? hoverStyle.backgroundColor : '#FFFFFF';
    e.currentTarget.style.color = hover ? hoverStyle.color : '#374151';
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} ref={dropdownRef}>
      <button
        onClick={() => setOpen(o => !o)}
        style={btnStyle}
        aria-label="Mostrar acciones"
      >
        <MoreVertical style={iconStyle} />
      </button>

      <div style={dropdownStyle}>
        <button
          onClick={() => {
            manejarGenerarEntrega(orden);
            setOpen(false);
          }}
          style={itemStyle}
          onMouseEnter={(e) => handleHover(e, true)}
          onMouseLeave={(e) => handleHover(e, false)}
        >
          Generar Entrega
        </button>

        <button
          onClick={() => {
            manejarVerEntregas(orden);
            setOpen(false);
          }}
          style={itemStyle}
          onMouseEnter={(e) => handleHover(e, true)}
          onMouseLeave={(e) => handleHover(e, false)}
        >
          Ver Entregas
        </button>
      </div>
    </div>
  );
};

export default BotonAcciones;
