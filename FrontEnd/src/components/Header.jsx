import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Componente de encabezado de la aplicación con enlaces de navegación.
 * Resalta el enlace activo usando useLocation.
 */
const Header = () => {
  const location = useLocation();

  // Estilos base para todos los enlaces
  const baseLinkStyle = {
    color: 'white',
    margin: '0 20px',
    textDecoration: 'none',
    fontWeight: 'normal',
    padding: '5px 10px',
    borderRadius: '5px',
    transition: 'background-color 0.3s',
  };

  // Estilo para el enlace activo
  const activeLinkStyle = {
    ...baseLinkStyle,
    fontWeight: 'bold',
    backgroundColor: '#0056b3', // Un azul más oscuro para resaltar
  };

  // Función para obtener el estilo, comparando el path actual con el path del enlace
  const getLinkStyle = (path) => {
    return location.pathname === path ? activeLinkStyle : baseLinkStyle;
  };

  return (
    <header style={{ 
      backgroundColor: '#007bff', 
      color: 'white', 
      padding: '15px', 
      textAlign: 'center', 
      marginBottom: '30px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ marginBottom: '15px', fontSize: '2em' }}>
        🧠 App de gestion de estudio personalizado
      </h1>
      <nav>
        <Link to="/" style={getLinkStyle('/')}>
          🏠 Inicio
        </Link>
        {/* Usamos /sesion-form como ejemplo de la ruta donde se encuentra el formulario */}
        <Link to="/sesion-form" style={getLinkStyle('/sesion-form')}>
          ➕ Planificar Sesión
        </Link>
        <Link to="/gestor-estudio" style={getLinkStyle('/gestor-estudio')}>
          📊 Gestor de Estudio
        </Link>
      </nav>
    </header>
  );
};

export default Header;