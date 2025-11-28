import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
    const navigate = useNavigate();
    
    // Estado para capturar los datos del formulario
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault(); // Previene el comportamiento por defecto del formulario

        // 1. Validaciones básicas
        if (!username || !email || !password) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        setLoading(true);
        setError('');
console.log('Iniciando registro con:', { username, email, password });
        try {
            // 2. Llamada al backend: POST /register
            const response = await fetch('http://localhost:3000/register', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password,
                }),
            });
console.log ('Respuesta del servidor:', response);
            // 3. Procesar la respuesta
            const data = await response.json();
console.log ('Datos recibidos:', data);
            if (!response.ok) {
                // Si la respuesta no es 2xx (ej: 400, 401, 500)
                setError(data.error || 'Fallo en el registro. Inténtalo de nuevo.');
            } else {
                // Registro exitoso (Respuesta 201)s
                console.log('Registro exitoso:', data);
                
                // 4. Guardar token y redirigir al área protegida
                localStorage.setItem('token', data.token);
                // navigate('/crear-sesion'); // Redirige a la página principal de la app
                alert('Registro exitoso! Serás redirigido a Crear Sesión.');
                navigate('/crear-sesion');
            }

        } catch (err) {
            console.error('Error de red al registrar:', err);
            setError('Error de conexión con el servidor.');
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <header className="bg-blue-600 text-white p-4 text-center mb-6 shadow-md">
                <h1 className="text-xl md:text-2xl font-semibold">🧠 App de gestion de estudio personalizado</h1>
            </header>
            
            <div className="flex flex-col items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-sm">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Registra tu cuenta</h2>

                    {/* Mensaje de Error */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister}>
                        
                        {/* Campo Nombre Completo / Username */}
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2 text-left">
                                Nombre completo (Username)
                            </label>
                            <input
                                id="username"
                                type="text"
                                placeholder="Tu nombre de usuario"
                                className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>

                        {/* Campo Correo Electrónico */}
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2 text-left">
                                Correo electrónico
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="correo@ejemplo.com"
                                className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>

                        {/* Campo Contraseña */}
                        <div className="mb-6">
                            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2 text-left">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Crea una contraseña segura"
                                className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>

                        {/* Botón de Registro */}
                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Registrando...' : 'Registrar Cuenta'}
                        </button>
                    </form>

                    {/* Link a Login */}
                    <div className="mt-4 text-center">
                        <Link to="/Login" className="text-sm text-blue-600 hover:underline">
                            ¿Ya tenés cuenta? Inicia sesión
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}