// components/GestorEstudio.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import HeaderNavegacion from './HeaderNavegacion';
import SesionesList from './SesionesList';
import TareasPorFecha from './TareasPorFecha';
import Header from './Header';


const GestorEstudio = () => {
  const [vistaActual, setVistaActual] = useState('sesiones'); // 'sesiones' o 'fechas'
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const authToken = localStorage.getItem('authToken');
  console.log('Auth Token en GestorEstudio:', authToken);
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

  // Función para cargar datos
  const fetchSesiones = async () => {
    setLoading(true);
    setError(null);

if (!authToken) {
        console.error('❌ Token de autenticación no encontrado. Redirigiendo a login.');
        navigate('/Login'); 
        setError('No autorizado. Por favor, inicia sesión.');
        setLoading(false);
        return; 
    }
  const config = {
        headers: {
            'Authorization': `Bearer ${authToken}` // Formato estándar JWT
        }
    };

    try {
      console.log('🔍 Iniciando carga de sesiones...');
      const response = await axios.get(`${API_BASE_URL}/sesiones/${localStorage.getItem('UserId')}`, config);
      console.log('📦 Respuesta recibida:', response.data);
      setData(response.data);
    } catch (err) {
      const errorMsg = 'Error al cargar las sesiones: ' + (err.response?.data?.message || err.message);
      console.error('❌ Error:', errorMsg, err);
      setError(errorMsg);
    } finally {
      setLoading(false);
      console.log('✅ Carga de sesiones completada');
    }
  };

  useEffect(() => {
    fetchSesiones();
  }, []);

  // Funciones de manejo de eventos que se pasarán a los componentes hijos
  const handleTareaClick = (tarea, sesionPadre) => {
    console.log("📍 Navegando a gestionar tarea:", tarea.id, tarea.nombre);
    navigate(`/tareas/${tarea.id}`, { 
      state: { 
        tarea: tarea,
        sesion: sesionPadre
      } 
    });
  };

  const handleSessionClick = (sesion) => {
    console.log("📍 Navegando a detalles de sesión:", sesion.id);
    navigate(`/${sesion.id}`, { state: { sesion } });
  };

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm("¿Confirmas que deseas eliminar esta sesión de estudio?")) {
      console.log('❌ Eliminación de sesión cancelada');
      return;
    }

    console.log('🗑️ Eliminando sesión:', sessionId);
    try {
      await axios.delete(`${API_BASE_URL}/${sessionId}`);
      console.log('✅ Sesión eliminada con éxito');
      alert('Sesión eliminada con éxito.');
      fetchSesiones();
    } catch (err) {
      const errorMsg = 'Error al eliminar sesión: ' + (err.response?.data?.message || 'Error desconocido');
      console.error('❌ Error eliminando sesión:', errorMsg, err);
      alert(errorMsg);
    }
  };

  const handleDeleteTarea = async (tareaId, tareaNombre) => {
    if (!window.confirm(`⚠️ ¿Deseas eliminar la tarea: "${tareaNombre}"?`)) {
      console.log('❌ Eliminación de tarea cancelada');
      return;
    }

    console.log('🗑️ Eliminando tarea:', tareaId, tareaNombre);
    try {
      await axios.delete(`${API_BASE_URL}/tareas/${tareaId}`);
      console.log('✅ Tarea eliminada con éxito');
      alert(`Tarea "${tareaNombre}" eliminada con éxito.`);
      fetchSesiones();
    } catch (err) {
      const errorMsg = 'Error al eliminar tarea: ' + (err.response?.data?.message || 'Error desconocido');
      console.error('❌ Error eliminando tarea:', errorMsg, err);
      alert(errorMsg);
    }
  };

  const handleGestionarTarea = async (tareaId, action) => {
    console.log(`🎯 Gestionando tarea ${tareaId} con acción: ${action}`);
    try {
      const response = await axios.post(`${API_BASE_URL}/tareas/${tareaId}/gestionar`, {
        config,
        action: action,
        tiempo_ejecutado: 30
      });
      
      console.log('✅ Tarea gestionada:', response.data);
      //alert(`Tarea ${action} exitosamente`);
      fetchSesiones();
    } catch (err) {
      const errorMsg = 'Error al gestionar tarea: ' + (err.response?.data?.message || 'Error desconocido');
      console.error('❌ Error gestionando tarea:', errorMsg, err);
      alert(errorMsg);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p>Cargando sesiones...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={fetchSesiones}>Reintentar</button>
      </div>
    );
  }
  
  if (data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p>No hay sesiones planificadas.</p>
        <button onClick={() => navigate('/crear-sesion')}>Crear primera sesión</button>
      </div>
    );
  }

  return (
    <>
    
         <Header />
    
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header de navegación */}
      <HeaderNavegacion 
        vistaActual={vistaActual}
        onCambiarVista={setVistaActual}
      />
      
      {/* Contenido según vista seleccionada */}
      {vistaActual === 'sesiones' ? (
        <SesionesList 
          sesiones={data}
          onSessionClick={handleSessionClick}
          onTareaClick={handleTareaClick}
          onDeleteSession={handleDeleteSession}
          onDeleteTarea={handleDeleteTarea}
          onGestionarTarea={handleGestionarTarea}
        />
      ) : (
        <TareasPorFecha 
          sesiones={data}
          onTareaClick={handleTareaClick}
          onDeleteTarea={handleDeleteTarea}
          onGestionarTarea={handleGestionarTarea}
        />
      )}
    </div>
    </>
  );
};

export default GestorEstudio;
