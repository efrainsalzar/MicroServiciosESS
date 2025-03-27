const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'user_db'
});

// Manejo de errores mejorado
db.connect((err) => {
  if (err) {
      console.error('Error detallado de conexión a la base de datos:', {
          message: err.message,
          code: err.code,
          errno: err.errno,
          sqlState: err.sqlState,
          fatal: err.fatal
      });
      return;
  }
  console.log('Conexión exitosa a la base de datos');
});

//db.end();

module.exports = db;