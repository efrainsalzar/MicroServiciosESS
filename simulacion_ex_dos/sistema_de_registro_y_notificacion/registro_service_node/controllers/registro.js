const Registro = require('../models/registro');

const crearRegistro = async (req, res) => {
  try {
    const { nombre, descripcion, email } = req.body;

    if (!nombre || !email) {
      return res.status(400).json({ error: 'Nombre y correo son obligatorios' });
    }

    const nuevoRegistro = await Registro.create({ nombre, descripcion, email });

    res.status(201).json({
      mensaje: 'Registro creado con éxito',
      data: nuevoRegistro
    });

  } catch (error) {
    console.error('Error al crear registro:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

const mostrarRegistros = async (req, res) => {
  try {
    const registros = await Registro.findAll();
    res.json(registros);
  } catch (error) {
    console.error('Error al obtener registros:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = {
  crearRegistro,
  mostrarRegistros
};
