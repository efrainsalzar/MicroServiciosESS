const express = require('express');
const router = express.Router();
const productController = require('./productController');

// Obtener todos los productos
router.get('/', productController.getAllProducts);

// Crear un nuevo producto
router.post('/', productController.createProduct);

// Obtener un producto por ID
router.get('/:id', productController.getProductById);

// Actualizar un producto por ID
router.put('/:id', productController.updateProduct);

// Eliminar un producto por ID
router.delete('/:id', productController.deleteProduct);

module.exports = router;
