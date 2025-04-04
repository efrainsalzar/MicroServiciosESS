// src/controllers/invoiceController.js
const Factura = require('../models/invoiceModel');

// Crear una nueva factura
const createInvoice = async (req, res) => {
  try {
    const { cliente_id } = req.body;
    const nuevaFactura = await Factura.create({ cliente_id });
    res.status(201).json(nuevaFactura);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la factura.' });
  }
};

// Obtener todas las facturas
const getAllInvoices = async (req, res) => {
    try {
      const facturas = await Factura.findAll();
      if (!facturas || facturas.length === 0) {
        return res.status(404).json({ error: 'No se encontraron facturas.' });
      }
      res.status(200).json(facturas);
    } catch (error) {
      console.error('Error al obtener las facturas:', error); // Esto ayudará a ver el error completo
      res.status(500).json({ error: `Error al obtener las facturas: ${error.message}` });
    }
  };

// Obtener una factura por ID
const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const factura = await Factura.findByPk(id);
    if (!factura) return res.status(404).json({ error: 'Factura no encontrada.' });
    res.status(200).json(factura);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la factura.' });
  }
};

// Actualizar una factura
const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { cliente_id } = req.body;
    const factura = await Factura.findByPk(id);
    if (!factura) return res.status(404).json({ error: 'Factura no encontrada.' });

    factura.cliente_id = cliente_id || factura.cliente_id;
    await factura.save();
    res.status(200).json(factura);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la factura.' });
  }
};

// Eliminar una factura
const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const factura = await Factura.findByPk(id);
    if (!factura) return res.status(404).json({ error: 'Factura no encontrada.' });

    await factura.destroy();
    res.status(204).json({ message: 'Factura eliminada.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la factura.' });
  }
};

module.exports = {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
};
