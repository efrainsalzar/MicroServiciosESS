// src/routes/invoiceDetailRoutes.js
const express = require('express');
const router = express.Router();
const {
  createDetalleFactura,
  getDetallesFactura,
  updateDetalleFactura,
  deleteDetalleFactura
} = require('../controllers/invoiceDetailController');

// Ruta para crear un detalle de factura
router.post('/', createDetalleFactura);

// Ruta para obtener los detalles de una factura específica
router.get('/:factura_id', getDetallesFactura);

// Ruta para actualizar un detalle de factura
router.put('/:id', updateDetalleFactura);

// Ruta para eliminar un detalle de factura
router.delete('/:id', deleteDetalleFactura);

module.exports = router;
