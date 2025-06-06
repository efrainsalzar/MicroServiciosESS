// config/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Usuarios',
      version: '1.0.0',
      description: 'Documentación de la API para el manejo de usuarios',
    },
    servers: [
      {
         url: `http://localhost:${process.env.SWAGGER_HOST_PORT || process.env.PORT}`, 
        description: 'Servidor de desarrollo',
      },      {
        url: `http://app:${process.env.PORT}`,
        description: 'Docker container server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{
      bearerAuth: [],
    }],
  },
  apis:[
    path.join(__dirname, '../routes/*.js'), // Ruta al archivo de documentación Swagger
    path.join(__dirname, '../docs/user_swagger.js') // Ruta al archivo de documentación Swagger
  ]
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    customSiteTitle: 'Users API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
  }));
};