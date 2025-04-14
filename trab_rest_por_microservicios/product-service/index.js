require('dotenv').config();
const express = require('express');
const app = express();
const sequelize = require('./sequelize');
const routes = require('./productRoutes');

// Middleware para JSON
app.use(express.json());

// Rutas
app.use('/products', routes);

// Iniciar servidor y conectar base de datos
const PORT = process.env.PORT;

sequelize.sync()
  .then(() => {
    console.log('Conectado a la base de datos.');
    app.listen(PORT, () => {
      console.log(`Product Service corriendo en el puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al conectar con la base de datos:', err);
  });
