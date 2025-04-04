// src/routes/invoiceRoutes.js
const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

// Crear nueva factura
router.post('/', invoiceController.createInvoice);

// Obtener todas las facturas
router.get('/', invoiceController.getAllInvoices);

// Obtener factura por ID
router.get('/:id', invoiceController.getInvoiceById);

// Actualizar factura
router.put('/:id', invoiceController.updateInvoice);

// Eliminar factura
router.delete('/:id', invoiceController.deleteInvoice);

module.exports = router;
