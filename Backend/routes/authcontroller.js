// controllers/authcontroller.js

// Necesitas haber ejecutado: npm install bcrypt jsonwebtoken crypto-js
import CryptoJS from 'crypto-js';
import db from '../models/index.js'; // Asegúrate que la ruta sea correcta
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken'; 

// Clave secreta para desencriptar el transporte (DEBE COINCIDIR con la del frontend)
const CLIENT_SECRET_KEY = process.env.CLIENT_SECRET_KEY || 'clave_secreta_por_defecto'; 

const JWT_SECRET = process.env.JWT_SECRET;
console.log('Valor de JWT_SECRET en authcontroller.js:', JWT_SECRET);
// Asegura que SALT_ROUNDS sea un número
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || 10, 10);

// Función de Desencriptación para el transporte (solo relevante para LOGIN)
const decryptTransport = (encryptedText) => {
    if (!encryptedText) return ""; 

    try {
        const bytes = CryptoJS.AES.decrypt(encryptedText, CLIENT_SECRET_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error("Error al desencriptar el payload de transporte:", error);
        return null; 
    }
};

// Generar token JWT
const generateToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: '30d', 
    });
};

// =======================================================
// 1. LOGIN (POST /login)
// =======================================================
export const login = async (req, res) => {
    const { encryptedUser, encryptedPassword } = req.body;
    console.log('Datos cifrados recibidos en login:', { encryptedUser, encryptedPassword });

    const userIdentifierlog = decryptTransport(encryptedUser); 
    const passwordlog = decryptTransport(encryptedPassword);   
console.log('Datos recibidos para login:', { userIdentifierlog, passwordlog: passwordlog });
    if (!userIdentifierlog || !passwordlog) {
        return res.status(400).json({ error: "Datos de credenciales incompletos o inválidos." });
    }

    try {
        const user = await db.User.findOne({
            where: {
                [db.Op.or]: [ // Buscamos por email O username
                    { username: userIdentifierlog },
                    { email: userIdentifierlog }
                ]
            }
        });

console.log('Usuario encontrado en DB:', user ? user.toJSON() : null);  
        
        // 🔑 CORRECCIÓN CRÍTICA: Comparar la contraseña de texto plano (passwordlog)
        // contra el HASH de la DB (user.password). NO desencriptar el hash.
        if (user && (await bcrypt.compare(passwordlog, user.password))) {
        console.log('Credenciales válidas para el usuario:', user.username, user.email);
            const token = generateToken(user.id);
            console.log('Token JWT generado:', token);
            return res.status(200).json({ 
                message: "Login exitoso con mensaje del backend",
                user: { id: user.id, username: user.username, email: user.email },
                token: token
            });

        } else {
            console.log('Fallo de credenciales: Contraseña no coincide o usuario no encontrado.');
            return res.status(401).json({ error: "Credenciales inválidas. Usuario o contraseña incorrectos." });
        }

    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        return res.status(500).json({ error: "Error interno del servidor al procesar el login." });
    }
};

// =======================================================
// 2. REGISTER (POST /register)
// =======================================================
export const register = async (req, res) => {
    const { username, email, password: plainPassword } = req.body; 
    console.log('Datos recibidos para registro:', { username, email, plainPassword });
    console.log('Valor de SALT_ROUNDS en authcontroller.js:', SALT_ROUNDS);

    if (!username || !email || !plainPassword) {
        return res.status(400).json({ error: "Por favor, complete todos los campos requeridos (usuario, email, password)." });
    }

    try {
        const userExists = await db.User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ error: "El correo electrónico ya está registrado." });
        }

        const hashedPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS);
        // 🧪 DEBUG: Muestra el hash generado para verificar si es válido (debe empezar con $2b$)
        console.log('Hash generado por bcrypt:', hashedPassword);

        const newUser = await db.User.create({
            username,
            email,
            password: hashedPassword,
        });

        if (newUser) {
            const token = generateToken(newUser.id);
            
            return res.status(201).json({
                message: "Registro exitoso",
                user: { id: newUser.id, username: newUser.username, email: newUser.email },
                token,
            });
        }
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        return res.status(500).json({ error: "Error interno del servidor al registrar el usuario." });
    }
};