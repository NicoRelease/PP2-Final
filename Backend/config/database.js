import { Sequelize } from 'sequelize';

// La carga de dotenv se realiza en el archivo api/index.js (punto de entrada)

// ===================================
// 1. Detección de Entorno y Configuración
// ===================================

const isProduction = process.env.NODE_ENV === 'production' || process.env.DB_HOST;

let sequelize;

if (isProduction) {
    // === MODO PRODUCCIÓN (PostgreSQL/Supabase) ===
    console.log("🛠️ Usando configuración de PostgreSQL.");
    
    // NOTA: Para Supabase, es común que se necesite SSL/TLS.
    // Usamos el constructor con credenciales separadas para mayor claridad.
    sequelize = new Sequelize(
        process.env.DB_NAME, 
        process.env.DB_USER, 
        process.env.DB_PASSWORD, 
        {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            dialect: 'postgres',
            logging: false,
            dialectOptions: {
                ssl: {
                    require: true, 
                    rejectUnauthorized: false // Acepta certificados autofirmados como los de Supabase
                },
            },
            // 🔑 CLAVE VERCEL: Configura el pool de conexiones para Serverless
            pool: {
                max: 5,     // Máximo de conexiones abiertas
                min: 0,
                acquire: 30000,
                idle: 10000, // Desconecta después de 10 segundos de inactividad
            }
        }
    );

} else {
    // === MODO DESARROLLO (SQLite Local) ===
    const DB_FILE = process.env.DB_FILE || './data/dev_database.sqlite';
    console.log(`🛠️ Usando configuración de SQLite local: ${DB_FILE}`);

    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: DB_FILE,
        logging: false,
    });
}


// ===================================
// 2. FUNCIÓN DE CONEXIÓN
// ===================================

// Función exportada para usar en backend/api/index.js
export async function connectDB() { 
    // Comprobamos si la sincronización está habilitada por variables de entorno (solo para entornos no productivos)
    const DB_SYNC_ENABLED = process.env.DB_SYNC_ENABLED === 'true'; 

    try {
        await sequelize.authenticate();
        console.log(`✅ Conexión a la DB (${isProduction ? 'PostgreSQL' : 'SQLite'}) establecida correctamente.`);
        
        // La sincronización solo debe hacerse en desarrollo/prueba, NUNCA en producción.
        if (DB_SYNC_ENABLED) {
            await sequelize.sync({ alter: true }); 
            console.log('✨ Sincronización de DB (alter: true) completada.');
        } else {
            console.log('✅ Modo de sincronización de DB DESHABILITADO. Se usarán las tablas existentes.');
        }

    } catch (error) {
        console.error('❌ ERROR CRÍTICO DE CONEXIÓN A LA BASE DE DATOS:', error.message);
        throw new Error('Fallo al conectar o sincronizar la base de datos.'); 
    }
}


// ===================================
// 3. EXPORTACIÓN DE LA INSTANCIA DE SEQUELIZE
// ===================================
export default sequelize;