const Client = require('../models/clientModel');

// Obtener todos los clientes
const getAllClients = async (req, res) => {
  try {
    const clients = await Client.findAll();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener los clientes', error: err });
  }
};

// Obtener un cliente por su CI
const getClientByCI = async (req, res) => {
  const { ci } = req.params;
  try {
    const client = await Client.findOne({ where: { ci } });
    if (client) {
      res.json(client);
    } else {
      res.status(404).json({ message: 'Cliente no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener el cliente', error: err });
  }
};

// Crear un cliente nuevo
const createClient = async (req, res) => {
  const { ci, nombres, apellidos, sexo } = req.body;
  try {
    const newClient = await Client.create({ ci, nombres, apellidos, sexo });
    res.status(201).json(newClient);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear el cliente', error: err });
  }
};

// Actualizar un cliente
const updateClient = async (req, res) => {
  const { ci } = req.params;
  const { nombres, apellidos, sexo } = req.body;
  try {
    const [updated] = await Client.update({ nombres, apellidos, sexo }, { where: { ci } });
    if (updated) {
      const updatedClient = await Client.findOne({ where: { ci } });
      res.json(updatedClient);
    } else {
      res.status(404).json({ message: 'Cliente no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar el cliente', error: err });
  }
};

// Eliminar un cliente
const deleteClient = async (req, res) => {
  const { ci } = req.params;
  try {
    const deleted = await Client.destroy({ where: { ci } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Cliente no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el cliente', error: err });
  }
};

module.exports = {
  getAllClients,
  getClientByCI,
  createClient,
  updateClient,
  deleteClient
};
