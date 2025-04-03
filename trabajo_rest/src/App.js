const express = require('express');
//const bodyParser = require('body-parser');
//const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const dotenv = require('dotenv');
const connectDB = require('../../Laboratorio_1/BD_SN_ORM/config/db');
//const clienteRoutes = require('./routes/cliente.routes');
//const facturaRoutes = require('./routes/factura.routes');
//const detalleFacturaRoutes = require('./routes/detalleFactura.routes');
//const productoRoutes = require('./routes/producto.routes');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


/*// Importar la conexión a la base de datos
// Middleware para parsear el cuerpo de las solicitudes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar la documentación de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestión de Ventas',
      version: '1.0.0',
      description: 'API para gestionar productos, clientes, facturas y detalles de facturas.',
    },
  },
  apis: ['./src/routes/*.js'], // Ruta para los archivos de rutas con anotaciones Swagger
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rutas de la API
app.use('/api/clientes', clienteRoutes);
app.use('/api/facturas', facturaRoutes);
app.use('/api/detalles-factura', detalleFacturaRoutes);
app.use('/api/productos', productoRoutes);

// Ruta por defecto
app.get('/', (req, res) => {
  res.send('Bienvenido a la API de Gestión de Ventas');
});

*/
// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

module.exports = app;
