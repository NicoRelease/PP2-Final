import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || 10, 10);

export default (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: { 
            type: DataTypes.STRING, 
            allowNull: false,
        },
        email: { 
            type: DataTypes.STRING, 
            allowNull: false,
            unique: true,
            validate: {
                isEmail: { msg: 'Debe ser un correo electrónico válido.' }
            }
        },
        password: { 
            type: DataTypes.STRING, // Almacena el hash, no la contraseña plana
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'users',
        timestamps: false,
        
        // ===============================================
        // 🔑 GANCHO (HOOK) CRUCIAL PARA LA SEGURIDAD
        // ===============================================
        hooks: {
            // Este gancho se ejecuta ANTES de que se cree o se actualice un registro.
            beforeCreate: async (user) => {
                const hashedPassword = await bcrypt.hash(user.password, BCRYPT_SALT_ROUNDS);
                user.password = hashedPassword;
            },
            beforeUpdate: async (user) => {
                // Solo si la contraseña ha sido modificada, la volvemos a hashear
                if (user.changed('password')) {
                    const hashedPassword = await bcrypt.hash(user.password, BCRYPT_SALT_ROUNDS);
                    user.password = hashedPassword;
                }
            }
        }
    });

    // ===============================================
    // 🔑 MÉTODO PARA LA VALIDACIÓN EN EL LOGIN
    // ===============================================
    User.prototype.validPassword = async function(password) {
        // Compara la contraseña plana (ingresada) con el hash almacenado
        return await bcrypt.compare(password, this.password);
    };

    return User;
};