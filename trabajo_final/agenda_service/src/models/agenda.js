const mongoose = require("mongoose");

const HorarioSchema = new mongoose.Schema(
  {
      fecha: { type: String, required: true }, // e.g., "2025-06-08"
      horas: [String],
  },
  { _id: false }
);

const AgendaSchema = new mongoose.Schema(
  {
    medico_id: {type: Number,required: true},
    especialidades: [
      {type: mongoose.Types.ObjectId,ref: "especialidad",required: true,},
    ],
    horarios_disponibles: [HorarioSchema],
  },
  {timestamps: true}
);

module.exports = mongoose.model("agenda", AgendaSchema, "agendas"); // 'agendas' es el nombre de la colección en MongoDB
