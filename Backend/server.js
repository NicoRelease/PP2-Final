import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {connectDB} from './config/database.js';

// 🔑 CLAVE: Importar los modelos y asociaciones ANTES de startServer()
import db from './models/index.js'; // Asegúrate de que esta ruta es correcta

// Importa tus routers aquí (Necesitas definir sesionesRouter)
import authRouter from './routes/authroutes.js';
import sesionesRouter from './routes/sesiones.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ===================================
// A. Middlewares Globales
// ===================================

// Middleware para habilitar CORS
app.use(cors({
    origin: '*', // ⚠️ Cambia esto a tu dominio(s) de frontend en producción
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para parsear JSON
app.use(express.json());

// ===================================
// B. Autenticación (Ejemplo de uso de bcrypt)
// ===================================
// NOTA: La lógica real de login iría en un controlador, esto es un ejemplo rápido
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

app.post('/test/hash', async (req, res) => {
    const password = req.body.password || 'password123';
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    res.json({ original: password, hash: hashedPassword });
});

// ===================================
// C. Rutas de la API (Ejemplo)
// ===================================
app.use('/', authRouter);
app.get('/', (req, res) => {
    res.send('Servidor Node.js con Express y PostgreSQL/Supabase listo.');
});
app.use('/api', sesionesRouter);

// Aquí irían tus rutas, p. ej.:
// import authRouter from './routes/auth.routes.js';
// app.use('/api/auth', authRouter);


// ===================================
// D. Inicialización
// ===================================

async function startServer() {
    // 1. Conectar a PostgreSQL
    await connectDB();

    // 2. Iniciar Express Server
    app.listen(PORT, () => {
        console.log(`🚀 Servidor Express.js iniciado en puerto ${PORT}`);
        console.log(`Entorno: ${process.env.NODE_ENV}`);
    });
}

startServer();