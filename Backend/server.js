// server.js 
import cors from 'cors';
import {connectDB} from './src/config/database.js';
import db from './src/models/index.js'; 
import authRouter from './src/routes/authroutes.js';
import sesionesRouter from './src/routes/sesiones.routes.js';
import dotenv from 'dotenv';
import express from 'express';

// ... (todas las demás importaciones de routers, modelos, etc.)

dotenv.config();

// 🔑 CORRECCIÓN: Definir 'app' aquí.
const app = express();
const PORT = process.env.PORT || 3000;

// ===================================
// A. Middlewares Globales
// ===================================

app.use(cors({ /* ... */ }));
app.use(express.json());

// ===================================
// B. Autenticación (Ejemplo de uso de bcrypt)
// ...
// ===================================

// ===================================
// C. Rutas de la API (Ejemplo)
// ===================================
app.use('/', authRouter); // ¡Ahora 'app' está definido!
app.use('/sesiones', sesionesRouter);
app.use('/api/sesiones', sesionesRouter);
// ... (resto de rutas)

// ... (parte final y exportación)

export default app;