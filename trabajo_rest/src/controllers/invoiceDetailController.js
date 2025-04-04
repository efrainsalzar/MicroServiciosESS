// src/controllers/invoiceDetailController.js
const DetalleFactura = require('../models/invoiceDetailModel');

// Crear detalle de factura
const createDetalleFactura = async (req, res) => {
  try {
    const { factura_id, producto_id, cantidad, precio } = req.body;
    const detalle = await DetalleFactura.create({ factura_id, producto_id, cantidad, precio });
    res.status(201).json(detalle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el detalle de la factura' });
  }
};

// Obtener detalles de una factura
const getDetallesFactura = async (req, res) => {
  try {
    const factura_id = req.params.factura_id;
    const detalles = await DetalleFactura.findAll({
      where: { factura_id },
      include: ['Factura', 'Producto'], // Incluir datos relacionados
    });
    if (detalles.length === 0) {
      return res.status(404).json({ error: 'No se encontraron detalles para esta factura' });
    }
    res.json(detalles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los detalles de la factura' });
  }
};

// Actualizar detalle de factura
const updateDetalleFactura = async (req, res) => {
  try {
    const { cantidad, precio } = req.body;
    const detalle = await DetalleFactura.findByPk(req.params.id);
    if (!detalle) {
      return res.status(404).json({ error: 'Detalle de factura no encontrado' });
    }
    detalle.cantidad = cantidad;
    detalle.precio = precio;
    await detalle.save();
    res.json(detalle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el detalle de la factura' });
  }
};

// Eliminar detalle de factura
const deleteDetalleFactura = async (req, res) => {
  try {
    const detalle = await DetalleFactura.findByPk(req.params.id);
    if (!detalle) {
      return res.status(404).json({ error: 'Detalle de factura no encontrado' });
    }
    await detalle.destroy();
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el detalle de la factura' });
  }
};

module.exports = {
  createDetalleFactura,
  getDetallesFactura,
  updateDetalleFactura,
  deleteDetalleFactura
};
