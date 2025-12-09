import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase'; // ← este archivo lo creamos en el paso anterior
import HeaderNoLink from './HeaderNoLink';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Si ya está logueado → redirigir automáticamente
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/gestor-estudio");
      }
    });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
      return;
    }

    // Login exitoso → token y usuario ya están en la sesión de Supabase
    console.log("Login exitoso:", data.user);
    
    // Ya no guardás nada manual en localStorage
    // Supabase lo hace automáticamente y lo mantiene seguro

    navigate("/gestor-estudio");
  };

  return (
    <div className="Tarjeta-Principal">
      <HeaderNoLink />

      <div className="Form-Container">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100"
        >

          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
              <p className="font-semibold">Error:</p>
              <p>{errorMessage}</p>
            </div>
          )}

          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-2">
              Correo:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ej: tu.correo@dominio.com"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 shadow-sm"
              required
              disabled={isLoading}
            />
          </div>

          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-2">
              Contraseña:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 shadow-sm"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-xl text-white font-bold transition duration-300 ${
              isLoading 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 shadow-lg'
            }`}
          >
            {isLoading ? "Conectando..." : "Iniciar sesión"}
          </button>

          <div className="mt-6 text-center">
            <Link 
              to="/Register" 
              className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline transition duration-150"
            >
              ¿No tienes cuenta? Regístrate aquí.
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}