import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../App.css';

/**
 * 💡 Configuración de los enlaces (Variables)
 */

const Title = "Optimizador de Estudio";

// ➡️ ENLACES DE NAVEGACIÓN PRINCIPAL (Para usuarios logueados)
const mainNavLinks = [
  { path: '/Crear-sesion', label: 'Inicio' },
  { path: '/gestor-estudio', label: 'Listado de sesiones' },
  { path: '//tareas/:tareaId', label: 'Tarea Manager' },
];

// ➡️ ENLACES DE AUTENTICACIÓN (Para usuarios NO logueados)
const authNavLinks = [
    { path: '/', label: 'Inicio' }, // La ruta raíz suele ser el login
     
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
    <header className="header">
      {/* Contenedor del Título y Navegación */}
      <div className="Links"> 
        <div className="Contenedor-Title">
          <h1>
          {Title}
        </h1>
        <div className='Contenedor-boton'>
          {/* Botón de Logout a la derecha */}
      <div className="ButtonLogout">
        {/* 💡 Condicional: Muestra el botón solo si NO estamos en Login o Register */}
        {shouldShowLogoutButton && (
          <button className ="ButtonLogout"
            onClick={handleLogout}
            
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#c82333'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dc3545'}
          >
            Cerrar Sesión
          </button>
        )}
      </div>
              </div>
        
        
        </div>
        <nav>
          <div style={{ flexGrow: 1, textAlign: 'left' }}>
            
            {/* 💡 RENDERIZADO CONDICIONAL DE ENLACES */}
            <div className='Links-Nav'>
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
            
          </div>
        </nav>
      </div>

      
    </header>
  );
};

export default HeaderNoLink;