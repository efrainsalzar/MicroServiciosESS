const express = require('express');
const sequelize = require('./config/db');
const registroRoutes = require('./routes/registro');

const app = express();
app.use(express.json());

app.get('/prueba', (req, res) => {
  res.send('Ruta de prueba funcionando');
});

app.use('/registros', registroRoutes);

const PORT = process.env.PORT;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
}).catch((err) => {
  console.error('Error al conectar con la base de datos:', err);
});
