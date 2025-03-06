const mongoose = require('mongoose');

const AgendaSchema = new mongoose.Schema({
    nombres: { type: String, required: true, maxlength: 40 },
    apellidos: { type: String, required: true, maxlength: 30 },
    direccion: { type: String, required: true, maxlength: 100 },
    telefono: { type: Number, required: true }
});

const Agenda = mongoose.model('Agenda', AgendaSchema);
module.exports = Agenda;
