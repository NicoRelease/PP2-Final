import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

/**
 * 💡 Configuración de los enlaces (Variables)
 */

const Title = "Optimizador de Estudio";

// ➡️ ENLACES DE NAVEGACIÓN PRINCIPAL (Para usuarios logueados)
const mainNavLinks = [
  { path: '/dashboard', label: '📊 Dashboard' },
  { path: '/agenda', label: '🗓️ Agenda' },
  { path: '/settings', label: '⚙️ Configuración' },
];

// ➡️ ENLACES DE AUTENTICACIÓN (Para usuarios NO logueados)
const authNavLinks = [
    { path: '/', label: '🏠 Inicio' }, // La ruta raíz suele ser el login
     
];

const HeaderNoLink = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Estilos base para todos los enlaces
  const baseLinkStyle = {
    color: 'white',
    margin: '0 15px',
    textDecoration: 'none',
    fontWeight: 'normal',
    padding: '5px 10px',
    borderRadius: '5px',
    transition: 'background-color 0.3s, opacity 0.3s',
  };

  /**
   * Maneja el proceso de cierre de sesión.
   */
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('UserId');
    navigate('/');
    console.log('Sesión cerrada y datos de autenticación eliminados.');
  };

  // ➡️ Lógica para verificar la página actual
  const currentPath = location.pathname;
  const isLoginPage = currentPath.endsWith('/Login') || currentPath === '/Login'; // Incluimos la raíz como página de autenticación
  const isRegisterPage = currentPath.endsWith('/Register') || currentPath === '/register';
  
  // 💡 Determinamos qué lista de enlaces usar
  // Si estamos en Login o Register, usamos authNavLinks. Si no, usamos mainNavLinks.
  const linksToRender = (isLoginPage || isRegisterPage) ? authNavLinks : mainNavLinks;
  
  // Condicional para mostrar/ocultar el botón de Logout
  const shouldShowLogoutButton = !(isLoginPage || isRegisterPage);


  return (
    <header style={{ 
      backgroundColor: '#4c545eff', 
      color: 'white', 
      padding: '15px', 
      textAlign: 'center', 
      marginBottom: '30px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      {/* Contenedor del Título y Navegación */}
      <div style={{ flexGrow: 1, textAlign: 'left' }}> 
        <h1 style={{ marginBottom: '15px', fontSize: '2em', paddingLeft: '15px' }}>
          {Title}
        </h1>
        <nav>
          <div style={{ flexGrow: 1, textAlign: 'left' }}>
            
            {/* 💡 RENDERIZADO CONDICIONAL DE ENLACES */}
            {linksToRender
              // Filtra: Oculta el enlace si el path coincide con la ruta actual
              .filter(link => link.path !== currentPath) 
              .map((link) => (
                <Link key={link.path} to={link.path} style={baseLinkStyle}> 
                  {link.label}
                </Link>
              ))
            }
          </div>
        </nav>
      </div>

      {/* Botón de Logout a la derecha */}
      <div>
        {/* 💡 Condicional: Muestra el botón solo si NO estamos en Login o Register */}
        {shouldShowLogoutButton && (
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'background-color 0.3s',
              marginRight: '15px',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#c82333'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dc3545'}
          >
            Cerrar Sesión 🚪
          </button>
        )}
      </div>
    </header>
  );
};

export default HeaderNoLink;