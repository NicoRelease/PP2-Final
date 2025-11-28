// config/database.js

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv'; // Si aún lo tienes aquí, lo eliminaremos en el paso 2

// 1. CONFIGURACIÓN E INSTANCIACIÓN
const DB_FILE = process.env.DB_FILE || './data/dev_database.sqlite';
const SYNC_ENABLED = true;


const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: DB_FILE,
    logging: false, // Deshabilitar logs de SQL por defecto
});


// 2. FUNCIÓN DE CONEXIÓN (Exportación Nombrada)
// Exportamos connectDB con nombre para usar en server.js
export async function connectDB() { 
    try {
        await sequelize.authenticate();
        console.log('El valor de DB_SYNC_ENABLED es', process.env.DB_SYNC_ENABLED === 'true');        
        console.log(`✅ Conexión a SQLite (${DB_FILE}) establecida correctamente.`);
        console.log('Syncronización de la base de datos está', SYNC_ENABLED ? 'HABILITADA' : 'DESHABILITADA');
        // LÓGICA DE SINCRONIZACIÓN CONDICIONAL
        if (SYNC_ENABLED) {
            await sequelize.sync({ alter: true }); 
            console.log('✨ BASE DE DATOS ESTRUCTURADA: Las tablas han sido creadas/actualizadas en la DB.');
            console.log('✅ Modo de sincronización habilitado y completado.');
        } else {
            console.log('✅ Modo de sincronización de DB DESHABILITADO. Se usarán las tablas existentes.');
        }

    } catch (error) {
        console.error('❌ ERROR CRÍTICO DE CONEXIÓN A LA BASE DE DATOS:', error.message);
        throw new Error('Fallo al conectar o sincronizar la base de datos.'); 
    }
}


// 3. EXPORTACIÓN DE LA INSTANCIA DE SEQUELIZE (Exportación por Defecto)
// 🔑 CLAVE: Exportamos la instancia sequelize para que models/index.js la use con .define
export default sequelize;