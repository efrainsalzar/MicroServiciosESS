const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'user_db'
});

db.connect((err) => {
    if (err) {
      console.error('Error conectando a la base de datos: ' + err.stack);
      return;
    }
    console.log('Conexión exitosa a la base de datos');
  });

//db.end();

module.exports = db;