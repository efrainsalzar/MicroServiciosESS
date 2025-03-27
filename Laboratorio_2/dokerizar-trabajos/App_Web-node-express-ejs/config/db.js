const mysql = require('mysql2');
require('dotenv').config();

const connectionConfig = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
};

// Función para intentar conectarse con reintentos
const connectWithRetry = (retries = 5, delay = 5000) => {
    const connection = mysql.createConnection(connectionConfig);

    connection.connect(err => {
        if (err) {
            console.error(`❌ Error conectando a MySQL: ${err.message}`);
            if (retries > 0) {
                console.log(`🔄 Reintentando en ${delay / 1000} segundos...`);
                setTimeout(() => connectWithRetry(retries - 1, delay), delay);
            } else {
                console.error('⛔ No se pudo conectar a MySQL después de varios intentos.');
            }
        } else {
            console.log('✅ Conectado a MySQL correctamente');

            // Crear la tabla si no existe
            connection.query(`
                CREATE TABLE IF NOT EXISTS usuarios (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    nombre VARCHAR(100),
                    correo VARCHAR(100),
                    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `, err => {
                if (err) console.error('⚠️ Error creando la tabla:', err);
            });
        }
    });

    return connection;
};

const connection = connectWithRetry();

module.exports = connection;
