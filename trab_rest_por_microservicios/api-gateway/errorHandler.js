const express = require('express');
const axios = require('axios');
const { handleAxiosError } = require('./errorHandler');  // Importar el manejador de errores
const router = express.Router();

// Definir las rutas del API Gateway

// Obtener todos los productos
router.get('/products', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:3002/products');
    res.json(response.data);
  } catch (error) {
    handleAxiosError(error, res);  // Manejar el error utilizando la función común
  }
});

// Crear un nuevo producto
router.post('/products', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:3002/products', req.body);
    res.status(201).json(response.data);
  } catch (error) {
    handleAxiosError(error, res);
  }
});

// Obtener un producto por ID
router.get('/products/:id', async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:3002/products/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    handleAxiosError(error, res);
  }
});

// Actualizar un producto
router.put('/products/:id', async (req, res) => {
  try {
    const response = await axios.put(`http://localhost:3002/products/${req.params.id}`, req.body);
    res.json(response.data);
  } catch (error) {
    handleAxiosError(error, res);
  }
});

module.exports = router;
