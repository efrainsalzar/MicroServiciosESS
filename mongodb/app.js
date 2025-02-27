const conectarDB = require('./config/db'); // Importar la función para conectar
const Usuario = require('./models/usuario'); // Importar el modelo de Usuario

// Conectar a la base de datos
conectarDB();

/*
Usuario.find()
  .then(usuarios => console.log('Usuarios encontrados:', usuarios))
  .catch(err => console.error('Error al obtener usuarios:', err));
*/