import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // ⬅️ Agregamos useNavigate

/**
 * Componente de encabezado de la aplicación con enlaces de navegación y botón de cierre de sesión.
 * Resalta el enlace activo usando useLocation.
 */
const HeaderNoLink = () => {
  const location = useLocation();
  const navigate = useNavigate(); // ⬅️ Inicializamos useNavigate

  // Estilos base para todos los enlaces
  const baseLinkStyle = {
    color: 'white',
    margin: '0 15px', // Ajustado ligeramente para dejar espacio al botón de logout
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

  /**
   * Maneja el proceso de cierre de sesión.
   * 1. Elimina los tokens de autenticación y datos del usuario del almacenamiento local.
   * 2. Redirige al usuario a la página de inicio (generalmente el login).
   */
  const handleLogout = () => {
    // Limpiar el token de autenticación
    localStorage.removeItem('authToken');
    // Limpiar el ID de usuario
    localStorage.removeItem('UserId');
    
    // Redirigir al usuario a la página de inicio/login
    navigate('/');
    console.log('Sesión cerrada y datos de autenticación eliminados.');
  };

  return (
    <header style={{ 
      backgroundColor: '#007bff', 
      color: 'white', 
      padding: '15px', 
      textAlign: 'center', 
      marginBottom: '30px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex', // Usamos flexbox para centrar y distribuir mejor
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      {/* Contenedor del Título y Navegación */}
      <div style={{ flexGrow: 1, textAlign: 'left' }}> 
        <h1 style={{ marginBottom: '15px', fontSize: '2em', paddingLeft: '15px' }}>
          🧠 App de gestion de estudio personalizado
        </h1>
        <nav>
          <div style={{ flexGrow: 1, textAlign: 'centered' }}>
            <Link to="/" style={getLinkStyle('/')}>
                      🏠 Inicio
          </Link>
          </div>
          
        </nav>

      </div>

      {/* Botón de Logout a la derecha */}
      
    </header>
  );
};

export default HeaderNoLink;