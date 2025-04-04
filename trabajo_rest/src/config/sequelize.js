const { Sequelize } = require('sequelize');
require('dotenv').config({path:'../.env'}); // Cargar variables de entorno desde .env


// Crea la instancia de Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,      // Nombre de la base de datos
  process.env.DB_USER,      // Usuario
  process.env.DB_PASSWORD,  // Contraseña
  {
    host: process.env.DB_HOST,  // Servidor de la base de datos
    dialect: 'mysql', // Tipo de base de datos
    logging: false,   // Desactiva el logging de SQL, puedes poner `console.log` si quieres verlo
  }
);

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);

// Verifica la conexión
sequelize.authenticate()
  .then(() => console.log('Conexión con la base de datos establecida correctamente.'))
  .catch(err => console.error('No se pudo conectar a la base de datos:', err));

module.exports = sequelize;
