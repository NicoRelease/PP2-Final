// components/GestorEstudio.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase'; // ← Tu cliente de Supabase
import HeaderNavegacion from './HeaderNavegacion';
import SesionesList from './SesionesList';
import TareasPorFecha from './TareasPorFecha';
import HeaderNoLink from './HeaderNoLink';
import '../App.css';

const API_URL = 'https://wkojgwlfvegdexspucq.supabase.co/functions/v1/api';

const GestorEstudio = () => {
  const [vistaActual, setVistaActual] = useState('sesiones');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Obtiene el token automáticamente (¡ADIÓS localStorage hack!)
  const getAuthHeader = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/Login');
      return null;
    }
    return { Authorization: `Bearer ${session.access_token}` };
  };

  // Cargar sesiones del usuario actual
  const fetchSesiones = async () => {
    setLoading(true);
    setError(null);

    const headers = await getAuthHeader();
    if (!headers) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/sesiones/${supabase.auth.getUser()?.data.user?.id}`, {
        headers
      });

      if (!response.ok) throw new Error('Error en la respuesta del servidor');

      const result = await response.json();
      setData(result.data || result); // Ajusta según tu respuesta
    } catch (err) {
      setError(err.message || 'Error al cargar sesiones');
      if (err.message.includes('401')) navigate('/Login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSesiones();
  }, []);

  // Eliminar sesión
  const handleDeleteSession = async (sessionId) => {
    if (!confirm('¿Eliminar esta sesión?')) return;

    const headers = await getAuthHeader();
    if (!headers) return;

    try {
      const res = await fetch(`${API_URL}/${sessionId}`, {
        method: 'DELETE',
        headers
      });

      if (!res.ok) throw new Error('Error al eliminar');

      alert('Sesión eliminada');
      fetchSesiones();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // Eliminar tarea
  const handleDeleteTarea = async (tareaId, tareaNombre) => {
    if (!confirm(`¿Eliminar tarea "${tareaNombre}"?`)) return;

    const headers = await getAuthHeader();
    if (!headers) return;

    try {
      const res = await fetch(`${API_URL}/tareas/${tareaId}`, {
        method: 'DELETE',
        headers
      });

      if (!res.ok) throw new Error('Error al eliminar tarea');

      alert('Tarea eliminada');
      fetchSesiones();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // Gestionar tarea (start/pause/complete)
  const handleGestionarTarea = async (tareaId, action) => {
    const headers = await getAuthHeader();
    if (!headers) return;

    try {
      const res = await fetch(`${API_URL}/tareas/${tareaId}/gestionar`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ accion: action })
      });

      if (!res.ok) throw new Error('Error al gestionar tarea');

      fetchSesiones();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleTareaClick = (tarea, sesionPadre) => {
    navigate(`/tareas/${tarea.id}`, { state: { tarea, sesion: sesionPadre } });
  };

  const handleSessionClick = (sesion) => {
    navigate(`/${sesion.id}`, { state: { sesion } });
  };

  if (loading) return <div className="text-center py-10">Cargando sesiones...</div>;
  if (error) return <div className="text-center py-10 text-red-600">Error: {error}</div>;
  if (data.length === 0) {
    return (
      <div className="text-center py-10">
        <p>No hay sesiones</p>
        <button onClick={() => navigate('/crear-sesion')} className="btn">
          Crear primera sesión
        </button>
      </div>
    );
  }

  return (
    <div className="Tarjeta-Principal">
      <HeaderNoLink />
      <HeaderNavegacion vistaActual={vistaActual} onCambiarVista={setVistaActual} />

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
  );
};

export default GestorEstudio;