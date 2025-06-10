// src/config/db.js
const mongoose = require('mongoose');

const connectDB = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('Conectado a MongoDB correctamente');
      return; // Salir si conecta bien
    } catch (error) {
      console.error(`Error al conectar a MongoDB (intento ${i + 1} de ${retries}):`, error.message);
      if (i < retries - 1) {
        console.log(`Reintentando en ${delay / 1000} segundos...`);
        await new Promise(res => setTimeout(res, delay)); // Espera antes de reintentar
      } else {
        console.error('No se pudo conectar a MongoDB tras varios intentos, saliendo...');
        process.exit(1);
      }
    }
  }
};

module.exports = connectDB;
