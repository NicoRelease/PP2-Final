import React, { useState } from 'react';
import { useNavigate, Link, data } from 'react-router-dom';
import { supabase } from '../lib/supabase'; // ← mismo archivo que usamos en Login
import HeaderNoLink from './HeaderNoLink';
import '../App.css';

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
console.log("Registering user with email:", email, "and username:", username, "and password:", password);
    // 1. Registro con Supabase Auth (email + password)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Guardamos el nombre de usuario en el campo "user_metadata"
        data: { username }
      }
    });
console.log("Supabase response data:", data);
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Registro exitoso!
    console.log('Usuario registrado:', data.user);

    // Opción A: Supabase envía email de confirmación por defecto
    // → Mostramos mensaje lindo
    alert('¡Registro exitoso! Revisa tu correo y confirma tu cuenta.');

    // Opción B: Si querés login automático después del registro (recomendado para UX)
    // Descomenta las 3 líneas de abajo:
     await supabase.auth.signInWithPassword({ email, password });
     navigate('/crear-sesion');
     return;

    // Por ahora redirigimos al login para que confirme el email
    navigate('/Login');
  };

  return (
    <div className="Tarjeta-Principal">
      <HeaderNoLink />

      <div className="Form-Container">
        <form
          onSubmit={handleRegister}
          className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100"
        >

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {/* Nombre completo / Username */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2 text-left">
              Nombre completo
            </label>
            <input
              type="text"
              placeholder="Tu nombre de usuario"
              className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {/* Email */}
          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-2">
              Correo:
            </label>
            <input
              type="email"
              placeholder="ej: tu.correo@dominio.com"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 shadow-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {/* Contraseña */}
          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-2">
              Contraseña:
            </label>
            <input
              type="password"
              placeholder="Crea una contraseña segura"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 shadow-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className= {`w-full py-3 rounded-xl text-black font-bold transition duration-300 ${
              loading 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 shadow-lg'
            }`}
          >
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </button>

          <div className="mt-6 text-center">
            <Link 
              to="/Login" 
              className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline transition duration-150"
            >
              ¿Ya tenés cuenta? Iniciar sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}