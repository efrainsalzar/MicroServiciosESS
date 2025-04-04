const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

// Rutas para los clientes
router.get('/', clientController.getAllClients);

// Obtener un cliente por su CI
router.get('/:ci', clientController.getClientByCI);

// Crear un nuevo cliente
router.post('/', clientController.createClient);

// Actualizar un cliente existente
router.put('/:ci', clientController.updateClient);

// Eliminar un cliente
router.delete('/:ci', clientController.deleteClient);

module.exports = router;
