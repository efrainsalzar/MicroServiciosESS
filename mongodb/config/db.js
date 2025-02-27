const mongoose = require('mongoose');

const mongoURI = 'mongodb://localhost:27017/universidad'; // Cambia el nombre de la base de datos

const conectarDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado a MongoDB');
  } catch (err) {
    console.error('Error al conectar a MongoDB:', err);
    process.exit(1); // Detener el proceso si no puede conectarse
  }
};

module.exports = conectarDB;