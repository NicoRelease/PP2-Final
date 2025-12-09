// routes/authroutes.js

import { Router } from 'express';
import * as authController from './authcontroller.js'; 

const router = Router();

// Esta ruta NO lleva el middleware 'protect'
// Maneja la petición POST /login del frontend
//router.post('/login', authController.login); 

// Si tienes una ruta de registro:
router.post('/register', authController.register);

export default router;