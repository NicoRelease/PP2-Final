// components/NewSessionForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase'; // Tu cliente Supabase
import HeaderNoLink from './HeaderNoLink';
import '../App.css';

const API_URL = 'https://wkojgwlfvegdexspucq.supabase.co/functions/v1/api';

const NewSessionForm = ({ onSesionCreada }) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nombre: '',
    fecha_examen: '',
    duracion_diaria_estimada: 60,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = name === 'duracion_diaria_estimada' 
      ? parseInt(value) || 0 
      : value;
    
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (formData.duracion_diaria_estimada < 10) {
      setError("La duración diaria debe ser de al menos 10 minutos.");
      setLoading(false);
      return;
    }

    // Obtener sesión y token automáticamente (ADIÓS localStorage!)
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setError("No estás autenticado. Redirigiendo...");
      setTimeout(() => navigate('/Login'), 1500);
      setLoading(false);
      return;
    }
    console.log("Form data sent to API antes del POST:", formData);
    try {
      const response = await fetch(`${API_URL}/sesiones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          ...formData,
          user_id: session.user.id  // Supabase ya sabe quién eres
        })
      });
      console.log("Form data sent to API:", formData);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al crear la sesión');
      }

      // Mensaje de éxito lindo
      const nombre = result.data?.nombre || formData.nombre;
      const tareas = result.data?.tareas?.length || 0;
      const totalMin = result.data?.duracion_total_estimada || 'calculado';

      setSuccessMessage(
        `¡Sesión "${nombre}" creada con éxito! 
         Se generaron ${tareas} tareas (${totalMin} min total estimado)`
      );

      // Callback para actualizar lista (si está en la misma página)
      if (onSesionCreada) onSesionCreada(result.data);

      // Resetear formulario
      setFormData({ nombre: '', fecha_examen: '', duracion_diaria_estimada: 60 });

      // Opcional: redirigir
      // setTimeout(() => navigate('/gestor-estudio'), 2000);

    } catch (err) {
      setError(err.message || 'Error desconocido al crear la sesión');
    } finally {
      setLoading(false);
    }
  };

  const hoy = new Date().toISOString().split('T')[0];

  return (
    <div className="Tarjeta-Principal">
      <HeaderNoLink />

      <div style={{
        padding: '30px',
        border: '2px solid #007bff',
        margin: '20px auto',
        borderRadius: '12px',
        maxWidth: '500px',
        backgroundColor: '#f8f9fa',
        boxShadow: '0 6px 20px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ textAlign: 'center', color: '#007bff', marginBottom: '25px' }}>
          Crear Nueva Sesión de Estudio
        </h3>

        {successMessage && (
          <div style={{
            backgroundColor: '#d4edda',
            color: '#155724',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #c3e6cb',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            {successMessage}
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #f5c6cb'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Nombre de la Sesión
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Ej: Final de Programación"
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '16px' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Fecha del Examen
            </label>
            <input
              type="date"
              name="fecha_examen"
              value={formData.fecha_examen}
              onChange={handleChange}
              min={hoy}
              required
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '16px' }}
            />
            <small style={{ color: '#666' }}>Fecha mínima: {hoy}</small>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Minutos por Día
            </label>
            <input
              type="number"
              name="duracion_diaria_estimada"
              value={formData.duracion_diaria_estimada}
              onChange={handleChange}
              min="10"
              max="480"
              required
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '16px' }}
            />
            <small style={{ color: '#666' }}>
              Se crearán tareas automáticas hasta el examen
            </small>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: loading ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Creando sesión...' : 'Crear Sesión'}
          </button>
        </form>

        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#1976d2'
        }}>
          <strong>Info:</strong> El sistema distribuirá automáticamente el estudio desde hoy hasta la fecha del examen.
        </div>
      </div>
    </div>
  );
};

export default NewSessionForm;