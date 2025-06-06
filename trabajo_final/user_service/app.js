require('dotenv').config();
const express = require('express');
const app = express();
const setupSwagger = require('./config/swagger');
const routes = require('./routes/user_route');

app.use(express.json());
app.use('/api', routes);
setupSwagger(app);  

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Servicio user corriendo en puerto ${PORT}`);
  console.log(`Documentación Swagger disponible en http://localhost:${PORT}/api-docs`);
});
