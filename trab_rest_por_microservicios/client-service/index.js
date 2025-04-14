require('dotenv').config();
const express = require('express');
const app = express();
const sequelize = require('./sequelize');
const routes = require('./clientRoutes');

// Middleware para JSON
app.use(express.json());

// Rutas
app.use('/clients', routes);

// Iniciar servidor y conectar base de datos
const PORT = process.env.PORT;

sequelize.sync()
  .then(() => {
    console.log('Conectado a la base de datos.');
    app.listen(PORT, () => {
      console.log(`Client Service corriendo en el puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al conectar con la base de datos:', err);
  });
