const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  edad: { type: Number },
});

const Usuario = mongoose.model('Usuario', usuarioSchema);
module.exports = Usuario;
