const mongoose = require("mongoose");

const EspecialidadSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
});


module.exports = mongoose.model("especialidad", EspecialidadSchema, 'especialidades');
