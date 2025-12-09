// components/TareaManager.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import HeaderNoLink from './HeaderNoLink';
import '../App.css';

const API_URL = 'https://wkojgwlfvegdexspucq.supabase.co/functions/v1/api';

const TareaManager = () => {
  const { tareaId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [tarea, setTarea] = useState(null);
  const [sesion, setSesion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tiempoTranscurrido, setTiempoTranscurrido] = useState(0);
  const [estaActiva, setEstaActiva] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [modo, setModo] = useState('tarea-especifica');

  // Helper para obtener token automáticamente
  const getHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/Login');
      return null;
    }
    return {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json'
    };
  };

  // Cargar tarea específica por ID
  const cargarTareaPorId = async (id) => {
    const headers = await getHeaders();
    if (!headers) return;

    try {
      const res = await fetch(`${API_URL}/tareas/${id}`, { headers });
      if (!res.ok) throw new Error('No se pudo cargar la tarea');
      const data = await res.json();
      setTarea(data.data || data);
      setSesion(data.data?.sesion || data.sesion);
      setModo('tarea-especifica');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cargar tarea del día
  const cargarTareaDelDia = async () => {
    const headers = await getHeaders();
    if (!headers) return;

    try {
      const res = await fetch(`${API_URL}/tarea-del-dia/actual`, { headers });
      const data = await res.json();

      if (data.tieneSesiones && data.tarea) {
        setTarea(data.tarea);
        setSesion(data.sesion);
        setModo('tarea-del-dia');
      } else {
        setModo('sin-sesiones');
      }
    } catch (err) {
      setError('Error al cargar tarea del día');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tareaId) {
      cargarTareaPorId(tareaId);
    } else {
      cargarTareaDelDia();
    }
  }, [tareaId]);

  // Inicializar tiempo cuando llega la tarea
  useEffect(() => {
    if (tarea?.tiempo_real_ejecucion !== undefined) {
      setTiempoTranscurrido(tarea.tiempo_real_ejecucion || 0);
    }
  }, [tarea]);

  // Temporizador
  useEffect(() => {
    if (estaActiva && !intervalId) {
      const id = setInterval(() => {
        setTiempoTranscurrido(prev => prev + 1);
      }, 1000);
      setIntervalId(id);
    } else if (!estaActiva && intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    return () => intervalId && clearInterval(intervalId);
  }, [estaActiva, intervalId]);

  const formatTiempo = (segundos) => {
    const h = Math.floor(segundos / 3600).toString().padStart(2, '0');
    const m = Math.floor((segundos % 3600) / 60).toString().padStart(2, '0');
    const s = (segundos % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const manejarAccion = async (accion) => {
    if (!tarea) return;

    const headers = await getHeaders();
    if (!headers) return;

    const tiempoEjecutado = (accion === 'stop' || accion === 'pause') ? tiempoTranscurrido : 0;

    try {
      const res = await fetch(`${API_URL}/tareas/${tarea.id}/gestionar`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ accion, tiempo_ejecutado: tiempoEjecutado })
      });

      if (!res.ok) throw new Error('Error al gestionar tarea');

      const result = await res.json();

      if (accion === 'start') {
        setEstaActiva(true);
      } else if (accion === 'pause') {
        setEstaActiva(false);
        setTarea(prev => ({ ...prev, ...result.data }));
      } else if (accion === 'stop') {
        setEstaActiva(false);
        setTiempoTranscurrido(0);
        setTarea(prev => ({ ...prev, es_completada: true, ...result.data }));
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const eliminarTarea = async () => {
    if (!tarea || !confirm('¿Eliminar esta tarea?')) return;

    const headers = await getHeaders();
    if (!headers) return;

    try {
      const res = await fetch(`${API_URL}/tareas/${tarea.id}`, {
        method: 'DELETE',
        headers
      });

      if (!res.ok) throw new Error('Error al eliminar');

      alert('Tarea eliminada');
      navigate('/gestor-estudio');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  if (loading) return <div className="text-center py-20">Cargando tarea...</div>;
  if (error) return <div className="text-center py-20 text-red-600">Error: {error}</div>;

  if (modo === 'sin-sesiones') {
    return (
      <div className="Tarjeta-Principal text-center py-20">
        <HeaderNoLink />
        <h1>No hay sesiones activas</h1>
        <p>Crea una nueva sesión para comenzar</p>
        <button onClick={() => navigate('/crear-sesion')} className="btn mx-2">
          Crear Sesión
        </button>
        <button onClick={() => navigate('/gestor-estudio')} className="btn">
          Ir al Gestor
        </button>
      </div>
    );
  }

  return (
    <div className="Tarjeta-Principal">
      <HeaderNoLink />

      <div className="max-w-4xl mx-auto p-6">
        <button onClick={() => navigate('/gestor-estudio')} className="mb-6">
          ← Volver
        </button>

        <h1 className="text-3xl font-bold mb-6">Gestor de Tarea</h1>

        {tarea && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold mb-4">{tarea.nombre}</h2>

            {!tarea.es_completada && (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <h3 className="text-xl mb-4">Temporizador</h3>
                <div className="text-5xl font-mono font-bold mb-6">
                  {formatTiempo(tiempoTranscurrido)}
                </div>

                <div className="space-x-4">
                  <button
                    onClick={() => manejarAccion('start')}
                    disabled={estaActiva}
                    className="btn bg-green-600 hover:bg-green-700"
                  >
                    Iniciar
                  </button>
                  <button
                    onClick={() => manejarAccion('pause')}
                    disabled={!estaActiva}
                    className="btn bg-yellow-600 hover:bg-yellow-700"
                  >
                    Pausar
                  </button>
                  <button
                    onClick={() => manejarAccion('stop')}
                    className="btn bg-blue-600 hover:bg-blue-700"
                  >
                    Completar
                  </button>
                </div>
              </div>
            )}

            {tarea.es_completada && (
              <div className="text-center py-8 text-green-600 text-2xl">
                TAREA COMPLETADA
              </div>
            )}

            {sesion && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <strong>Sesión:</strong> {sesion.nombre}
              </div>
            )}

            <button
              onClick={eliminarTarea}
              className="mt-6 btn bg-red-600 hover:bg-red-700"
            >
              Eliminar Tarea
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TareaManager;