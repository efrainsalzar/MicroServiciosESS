const {AuthenticationError, UserInputError} = require("apollo-server-express");
const Agenda = require("../models/agenda");

function validarFecha(fecha) {
  // Valida formato YYYY-MM-DD
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(fecha)) {
    throw new UserInputError("Formato de fecha inválido. Usa YYYY-MM-DD.");
  }
  return fecha;
}

const agendaResolvers = {
  Query: {
    getAgendas: async (_, __, context) => {
      if (!context.user) {
        throw new AuthenticationError("No autorizado. Token inválido o ausente.");
      }
      return await Agenda.find().populate("especialidades");
    },

    getAgenda: async (_, { id }) => {
      return await Agenda.findById(id).populate("especialidades");
    },

    getDisponibilidad: async (_, { especialidad, fecha }) => {
      const fechaNormalizada = validarFecha(fecha); // ⬅️ Validamos la fecha

      const agendas = await Agenda.find().populate("especialidades");

      const disponibles = agendas
        .filter((agenda) =>
          agenda.especialidades.some((e) => e.nombre === especialidad)
        )
        .map((agenda) => {
          const horariosFiltrados = agenda.horarios_disponibles.filter(
            (h) => {
              // Normaliza la fecha en Mongo para comparación
              const fechaBD = new Date(h.fecha).toISOString().split("T")[0];
              return fechaBD === fechaNormalizada;
            }
          );

          return {
            id: agenda._id.toString(),
            medico_id: agenda.medico_id,
            especialidades: agenda.especialidades,
            horarios_disponibles: horariosFiltrados,
            createdAt: agenda.createdAt,
            updatedAt: agenda.updatedAt,
          };
        })
        .filter((agenda) => agenda.horarios_disponibles.length > 0);

      if (disponibles.length === 0) {
        throw new UserInputError(
          `No hay disponibilidad para la especialidad "${especialidad}" en la fecha "${fecha}"`
        );
      }

      return disponibles;
    },
  },

  Mutation: {
    crearAgenda: async (
      _,
      { medico_id, especialidades, horarios_disponibles }
    ) => {
      const nuevaAgenda = new Agenda({
        medico_id,
        especialidades,
        horarios_disponibles,
      });
      await nuevaAgenda.save();
      return await Agenda.findById(nuevaAgenda._id).populate("especialidades");
    },

    borrarAgenda: async (_, { id }) => {
      return await Agenda.findByIdAndDelete(id);
    },
  },
};

module.exports = agendaResolvers;
