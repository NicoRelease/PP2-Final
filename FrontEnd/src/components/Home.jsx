import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    // Contenedor principal: Ocupa toda la altura y tiene el fondo.
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6">
      
      {/* Contenedor de Centrado: Simplificado para depender solo de items-center */}
      <div className="mx-auto max-w-lg flex flex-col items-center text-center">
        
        <img
          src="../src/assets/Home.jpg"
          alt="Imagen Home"
          className="rounded-2xl shadow-lg mb-6 w-full max-w-sm h-auto object-cover"
        />
        
        {/* Título - SIN DIV ADICIONAL */}
        <h1 className="text-3xl font-bold mb-4">Bienvenido a la Aplicación de estudio</h1>
        
        {/* Párrafo - SIN DIV ADICIONAL */}
        <p className="text-gray-700 mb-8 px-2">
          Esta es la página principal. Puedes ingresar para acceder a tu cuenta.
        </p>
        
        {/* Botón - SIN DIV ADICIONAL */}
        <button
          onClick={() => navigate("/Login")}
          // CLASES PARA EL EFECTO 3D (ver sección 2)
          className="px-8 py-3 bg-blue-600 text-black rounded-xl shadow-lg hover:bg-blue-700 active:translate-y-0.5 active:shadow-md transition duration-150 ease-in-out w-full sm:w-auto max-w-xs"
        >
          Ingresar
        </button>
        
      </div>
    </div>
  );
}