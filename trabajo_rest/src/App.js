const express = require('express');
const app = express();
const productRoutes = require('./routes/productRoutes');
const clientRoutes = require('./routes/clientRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const invoiceDetailRoutes = require('./routes/invoiceDetailRoutes');

// Middlewares
app.use(express.json());

// Rutas
app.use('/api/productos', productRoutes);
app.use('/api/clientes', clientRoutes);
app.use('/api/facturas', invoiceRoutes);
app.use('/api/detalles-factura', invoiceDetailRoutes);



/*// Ruta de prueba
app.get('/api/status', async (req, res) => {
    const db = require('./config/db');
    const [result] = await db.query('SELECT NOW() AS database_time');
    res.json({ status: 'OK', database_time: result[0].database_time });
});*/

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
