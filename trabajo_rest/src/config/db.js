const mysql = require('mysql2');
require('dotenv').config();

// Crear la conexión a la base de datos usando las variables de entorno
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

// Verificar la conexión
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    process.exit(1); // Salir si la conexión falla
  }
  console.log('Conexión a la base de datos MySQL exitosa.');
});

module.exports = connection;
