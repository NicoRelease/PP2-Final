import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";

const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);

export default (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
          isEmail: {
            msg: "Debe ser un correo electrónico válido.",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "users",
      timestamps: false,

      hooks: {
        // Antes de crear un usuario → hash
        beforeCreate: async (user) => {
          if (user.password) {
            const hashedPassword = await bcrypt.hash(
              user.password,
              BCRYPT_SALT_ROUNDS
            );
            user.password = hashedPassword;
          }
        },

        // Antes de actualizar → si cambió, hash
        beforeUpdate: async (user) => {
          if (user.changed("password")) {
            const hashedPassword = await bcrypt.hash(
              user.password,
              BCRYPT_SALT_ROUNDS
            );
            user.password = hashedPassword;
          }
        },
      },
    }
  );

  User.prototype.validPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  User.associate = function (models) {
    User.hasMany(models.Sesion, {
      foreignKey: "user_id",
      as: "sesiones",
    });
  };

  return User;
};
