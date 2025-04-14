require('dotenv').config(); // Carga variables desde .env

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,     // Nombre de la base de datos
  process.env.DB_USER,     // Usuario de la base de datos
  process.env.DB_PASS,     // Contraseña
  {
    host: process.env.DB_HOST,  // Host (por ejemplo: localhost)
    dialect: 'mysql',  // Especifica el tipo de base de datos que estás usando
  }

);

module.exports = sequelize;
