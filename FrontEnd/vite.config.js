// vite.config.js (CORREGIDO)

import { defineConfig, loadEnv } from 'vite' // 🔑 Importa loadEnv
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// 🔑 CAMBIO CLAVE: Usa defineConfig como una FUNCIÓN que recibe el modo de ejecución
export default defineConfig(({ mode }) => {
    
    // Carga las variables de entorno basándose en el 'mode' actual 
    // (lee .env.local en dev y .env.production en build)
    const env = loadEnv(mode, process.cwd(), '');

    // 🔑 Ahora API_URL está DEFINIDA y se puede usar en el proxy
    const API_URL = env.VITE_API_URL;
    
    // OPCIONAL: Esto te ayuda a verificar qué URL está leyendo
    console.log(`[Vite Config] API Proxy Target: ${API_URL}`); 

    return {
        plugins: [react(), tailwindcss()],
        server: {
            proxy: {
                // Todas las rutas de tu API usan la variable cargada
                '/login': {
                    target: API_URL, 
                    changeOrigin: true
                },
                '/token/verify': {
                    target: API_URL,
                    changeOrigin: true
                },
                '/ws': {
                    target: API_URL,
                    ws: true,
                    changeOrigin: true
                }
            }
        }
    }
})