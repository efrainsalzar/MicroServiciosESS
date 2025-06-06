require('dotenv').config();
const express = require('express');
const app = express();
const routes = require('./routes/user_route');

app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Servicio user corriendo en puerto ${PORT}`);
});
