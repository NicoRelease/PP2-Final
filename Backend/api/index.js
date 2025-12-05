// Archivo de Entrada para Vercel Serverless Function
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Importa la función de conexión a la DB
import { connectDB } from '../config/database.js'; // Ruta relativa desde 'backend/api/'

// Importa tus modelos
import db from '../models/index.js'; 

// Importa tus routers
import authRouter from '../routes/authroutes.js';
import sesionesRouter from '../routes/sesiones.routes.js';

// Librerías de Seguridad del server.js original
import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken'; // JWT no se usa directamente aquí, solo bcrypt

// Carga las variables de entorno (solo necesario para desarrollo local con 'vercel dev')
dotenv.config();

// Inicializamos la app Express fuera de la función exportada
const app = express();

// ===================================
// 1. Middlewares Globales
// ===================================

// Middleware para habilitar CORS
app.use(cors({
    // Usa la variable de entorno para el origen en producción.
    origin: process.env.CORS_ORIGIN || '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para parsear JSON
app.use(express.json());


// ===================================
// 2. Rutas de la API (Incluyendo la ruta de prueba)
// ===================================

// Ruta de prueba de Hashing (tomada de tu server.js original)
app.post('/api/test/hash', async (req, res) => {
    const password = req.body.password || 'password123';
    // Asegúrate de que BCRYPT_SALT_ROUNDS esté configurada en Vercel
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10; 
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        res.json({ original: password, hash: hashedPassword, saltRounds: saltRounds });
    } catch (error) {
        console.error("Error hashing password:", error);
        res.status(500).json({ error: "Fallo al hashear la contraseña." });
    }
});

// Ruta de prueba para la Serverless Function
app.get('/api', (req, res) => {
    res.send('Servidor Serverless de Estudio funcionando correctamente.');
});

// Enlazamos los routers.
// Usamos '/api' como prefijo para que sean manejados por Vercel.
app.use('/api', authRouter);
app.use('/api', sesionesRouter);


// ===================================
// 3. Exportación para Vercel
// ===================================

// Variable de bandera para asegurar que la conexión a la DB solo ocurre una vez.
let isDbConnected = false;

/**
 * Función Handler (Controlador) que Vercel ejecuta para cada solicitud.
 */
export default async (req, res) => {
    // Si la DB no está conectada, intentamos conectarla.
    if (!isDbConnected) {
        try {
            console.log('🔗 Conectando a la Base de Datos...');
            await connectDB();
            isDbConnected = true;
            console.log('✅ Base de Datos Conectada.');
        } catch (error) {
            console.error('❌ Error al conectar la Base de Datos:', error);
            // Si la conexión falla, respondemos inmediatamente con un error 500.
            res.status(500).send('Error interno del servidor: Fallo en la conexión a la base de datos. Verifique las variables de entorno.');
            return;
        }
    }
    
    // Pasamos el control a la aplicación Express.
    return app(req, res);
};