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
            console.log('Ingresando al If de SYNC_ENABLED...');
            await sequelize.sync({ alter: true }); 
            console.log('✨ BASE DE DATOS ESTRUCTURADA: Las tablas han sido creadas/actualizadas en la DB.');
            console.log('✅ Modo de sincronización habilitado y completado.');
        } else {
            console.log('✅ Modo de sincronización de DB DESHABILITADO. Se usarán las tablas existentes.');
            
            // ⬅️ **CORRECCIÓN:** Usar Sequelize para vaciar las tablas
            
            // ⚠️ NOTA: Debes asegurarte de que los modelos (User, Tarea, Sesion) 
            // han sido definidos e importados ANTES de este punto.

            console.log('🗑️ Vaciando datos de tablas existentes (User, Tarea, Sesion)...');
            
            // Opción 1: Usar .truncate() en los modelos (¡Recomendado!)
            // Esto es más limpio y usa TRUNCATE TABLE si la DB lo soporta, o DELETE FROM si no.
            if (User && Tarea && Sesion) { // Verificación de existencia de modelos
                await users.destroy({ truncate: true, cascade: true }); 
                await tareas.destroy({ truncate: true, cascade: true });
                await sesiones.destroy({ truncate: true, cascade: true });
                console.log('✅ Datos de tablas vaciados correctamente.');
            } else {
                console.warn('⚠️ No se pudieron vaciar las tablas: Los modelos (User, Tarea, Sesion) no están disponibles.');
            }         
        }
    } catch (error) {
        console.error('❌ ERROR CRÍTICO DE CONEXIÓN A LA BASE DE DATOS:', error.message);
        throw new Error('Fallo al conectar o sincronizar la base de datos.'); 
    }
}


// 3. EXPORTACIÓN DE LA INSTANCIA DE SEQUELIZE (Exportación por Defecto)
// 🔑 CLAVE: Exportamos la instancia sequelize para que models/index.js la use con .define
export default sequelize;