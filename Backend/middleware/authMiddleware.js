import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const protect = (req, res, next) => {
    // 1. Obtener el token del encabezado (Header)
    let token;
    
    // El token típicamente viene como: "Bearer TOKEN_AQUI"
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer')) {
        // Extraemos solo el token (quitando "Bearer ")
        try {
            token = authHeader.split(' ')[1];
            
            // 2. Verificar el token
            const decoded = jwt.verify(token, JWT_SECRET);
            
            // 3. Adjuntar la información del usuario a la solicitud
            // Esto permite acceder a req.user.id en tus controladores
            req.user = decoded; 
            
            // 4. Continuar con la siguiente función (el controlador de la ruta)
            next();

        } catch (error) {
            console.error('Error de verificación JWT:', error.message);
            return res.status(401).json({ 
                message: 'No autorizado, token fallido o expirado.',
                error: error.name
            });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'No autorizado, no se proporcionó token.' });
    }
};