import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MoreVertical } from 'lucide-react';

const BotonAccionesSubasta = ({ subasta, manejarVerContrato, manejarAsociarContrato }) => {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  // Cerrar al click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (btnRef.current && !btnRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Alterna menú y calcula posición
  const toggleOpen = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top + window.scrollY,
        left: rect.left + rect.width / 2 + window.scrollX
      });
    }
    setOpen(o => !o);
  };

  const btnStyle = {
    padding: 6, borderRadius: '50%', background: 'transparent',
    border: 'none', cursor: 'pointer'
  };
  const iconStyle = {
    width: 20, height: 20, color: '#6B7280',
    transform: open ? 'rotate(90deg)' : 'none',
    transition: 'transform 0.2s'
  };

  // Nuestro menú en portal
  const dropdown = open && createPortal(
    <div
      // Detenemos propagación para que no cierre el menú
      onClick={e => e.stopPropagation()}
      style={{
        position: 'absolute',
        top: coords.top - 6,
        left: coords.left,
        transform: 'translateX(-50%) translateY(-100%)',
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        padding: '4px 0'
      }}
    >
      <button
        onClick={() => { manejarVerContrato(subasta); setOpen(false); }}
        style={menuItemStyle}
      >
        Ver Contrato
      </button>
      <button
        onClick={() => { manejarAsociarContrato(subasta); setOpen(false); }}
        style={menuItemStyle}
      >
        Asociar Contrato
      </button>
    </div>,
    document.body
  );

  return (
    <>
      <button
        ref={btnRef}
        onClick={toggleOpen}
        style={btnStyle}
        aria-label="Mostrar acciones"
      >
        <MoreVertical style={iconStyle} />
      </button>
      {dropdown}
    </>
  );
};

const menuItemStyle = {
  padding: '6px 12px',
  background: 'transparent',
  border: 'none',
  textAlign: 'left',
  cursor: 'pointer',
  fontSize: 14,
  color: '#374151',
  transition: 'background 0.2s',
};

export default BotonAccionesSubasta;
