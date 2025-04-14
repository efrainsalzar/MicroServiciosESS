// server.js
const express = require('express');
const app = express();
const routes = require('./rutas');  // Importamos las rutas desde el archivo 'routes.js'

app.use(express.json());

// Usamos las rutas definidas en el archivo 'routes.js'
app.use('/api', routes);

app.listen(3000, () => {
  console.log('API Gateway corriendo en el puerto 3000');
});
