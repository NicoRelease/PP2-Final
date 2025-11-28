import express from 'express';
import { protect } from '../middleware/authMiddleware.js'; // Importamos el middleware
import * as sesionesController from '../controllers/sesionesController.js';

const router = express.Router();

// =======================================================
// RUTAS PARA SESIONES (SOLO ACCESIBLES CON TOKEN VÁLIDO)
// =======================================================

// 1. OBTENER todas las sesiones con sus tareas

// ... otras rutas

router.post('/validar-fecha', sesionesController.validarFechaExamen);

// 1. CREAR una nueva sesión con sus tareas
router.post('/', sesionesController.crearSesion);

// 2. OBTENER todas las sesiones con sus tareas
router.get('/', sesionesController.obtenerTodasLasSesiones);

// 3. OBTENER una sesión específica por ID
router.get('/:id', sesionesController.obtenerSesionPorId);

// 4. ELIMINAR una sesión completa (con todas sus tareas)
router.delete('/:id', sesionesController.eliminarSesionCompleta);

// 5. OBTENER la sesión activa (para el SessionManager)
router.get('/sesion-activa/actual', sesionesController.obtenerSesionActiva);

// 6. OBTENER tarea del día actual (para TareaManager)
router.get('/tarea-del-dia/actual', sesionesController.obtenerTareaDelDia);

// =======================================================
// RUTAS PARA TAREAS (CONTENIDO DE LAS SESIONES)
// =======================================================

// 7. GESTIONAR una tarea específica (start, pause, stop)
router.post('/tareas/:id/gestionar', sesionesController.gestionarTarea);

// 8. ELIMINAR una tarea específica
router.delete('/tareas/:id', sesionesController.eliminarTarea);

// 9. OBTENER una tarea específica por ID
router.get('/tareas/:id', sesionesController.obtenerTareaPorId);

// 10. Aplicamos el middleware 'protect' justo antes del controlador
router.get('/', protect, sesionesController.obtenerTodasLasSesionesUsuario);

// 12. OBTENER una sesión específica por ID
router.get('/:id', protect, sesionesController.obtenerSesionPorId);


export default router;