require('dotenv').config();
const express = require('express');
const app = express();

const setupSwagger = require('./config/swagger');
const routes = require('./routes/user_route');

app.use(express.json());

app.use('/api', routes);
setupSwagger(app);  

const PORT = process.env.PORT; // This is the internal container port (e.g., 3000)
const HOST_PORT = process.env.SWAGGER_HOST_PORT; // This is the host-mapped port (e.g., 3001)

app.listen(PORT, () => {
  console.log(`Servicio user corriendo internamente en puerto ${PORT}`);
  
  if (HOST_PORT && HOST_PORT !== PORT) {
    console.log(`Accesible desde tu máquina local en http://localhost:${HOST_PORT}`);
    console.log(`Documentación Swagger disponible en http://localhost:${HOST_PORT}/api-docs`);
  } else {
    // Esto se ejecutará si no estás en Docker o si el puerto del host es el mismo que el interno
    console.log(`Documentación Swagger disponible en http://localhost:${PORT}/api-docs`);
  }
});