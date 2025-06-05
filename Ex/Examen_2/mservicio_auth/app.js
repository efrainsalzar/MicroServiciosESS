require('dotenv').config();
const express = require('express');
const app = express();
const authRoutes = require('./routes/user_route');

app.use(express.json());
app.use('/api', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Auth corriendo en puerto ${PORT}`);
});
