const { AuthenticationError, UserInputError } = require("apollo-server-express");
const Especialidad = require('../models/especialidad');
const axios = require("axios");
const Agenda = require("../models/agenda");

function validarFecha(fecha) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(fecha)) {
    throw new UserInputError("Formato de fecha inválido. Usa YYYY-MM-DD.");
  }
  const date = new Date(fecha);
  if (isNaN(date.getTime())) {
    throw new UserInputError("Fecha inválida.");
  }
  //No permitir fechas pasadas
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date < today) {
    throw new UserInputError("No se pueden consultar fechas pasadas.");
  }
  return fecha;
}

function validarHora(hora) {
  const regex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  if (!regex.test(hora)) {
    throw new UserInputError("Formato de hora inválido. Usa HH:MM.");
  }
  return hora;
}

function validarHorarios(horarios) {
  return horarios.map(({ dia, horas }) => ({
    dia,
    horas: horas.map((hora) => validarHora(hora)),
  }));
}

function obtenerDiaSemana(fechaValida) {
  const [anio, mes, dia] = fechaValida.split("-").map(Number);
  const date = new Date(anio, mes - 1, dia); // Mes base 0
  const diasSemana = ["DOMINGO", "LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO"];
  return diasSemana[date.getDay()];
}

const url_service_user = "http://user_service:3000/api/get_id";

const agendaResolvers = {
  Query: {
    getMiAgenda: async (parent, agrs, context) => {
      if (!context.user) {
        throw new AuthenticationError("No autorizado. Token inválido o ausente.");
      }
      // Solo médicos pueden consultar su propia agenda
      if (context.user.role !== "medico") {
        throw new AuthenticationError("Solo los médicos pueden acceder a esta agenda.");
      }

      const medico_id = context.user.id;

      const agenda = await Agenda.findOne({ medico_id }).populate("especialidades");
      if (!agenda) {
        throw new UserInputError(`No se encontró agenda para el médico con ID ${medico_id}`);
      }
      return agenda;
    },

    getMedicosDisponibles: async (_, { especialidad, fecha }, context) => {
      if (!context.user) throw new AuthenticationError("No autorizado. Token inválido o ausente.");
      if (context.user.role !== "paciente") {
        throw new AuthenticationError("Solo los pacientes pueden acceder a esta agenda.");
      }

      const fechaValida = validarFecha(fecha);
      const diaSemana = obtenerDiaSemana(fechaValida);

      const agendas = await Agenda.find().populate("especialidades");

      const agendasFiltradas = agendas.filter(agenda =>
        agenda.especialidades.some(e => e.nombre.toLowerCase() === especialidad.toLowerCase())
      );

      if (agendasFiltradas.length === 0) {
        throw new UserInputError(`No hay médicos de ${especialidad} registrados.`);
      }

      const datosConHorario = agendasFiltradas
        .map(agenda => {
          const horarios = agenda.horarios_disponibles.filter(hd => hd.dia === diaSemana);
          return horarios.length > 0 ? {
            medico_id: agenda.medico_id,
            especialidades: agenda.especialidades,
            horarios_disponibles: horarios
          } : null;
        })
        .filter(Boolean);

      if (datosConHorario.length === 0) {
        throw new UserInputError(
          `No hay médicos de ${especialidad} disponibles el ${diaSemana} (${fechaValida})`
        );
      }

      // Si tu microservicio solo acepta GET con ID, hacer múltiples llamadas
      const resultados = await Promise.all(
        datosConHorario.map(async d => {
          try {
            const response = await axios.get(`${url_service_user}/${d.medico_id}`);
            //console.log("Nombre del médico obtenido:", response.data.name)
            return {
              medico_id: d.medico_id,
              nombre: response.data.name,
              especialidades: d.especialidades,
              horarios_disponibles: d.horarios_disponibles

            };
            
          } catch (err) {
            console.error("Error al obtener nombre del médico:", err.message);
            return {
              medico_id: d.medico_id,
              nombre: "Nombre no disponible",
              especialidades: d.especialidades,
              horarios_disponibles: d.horarios_disponibles
            };
          }
        })
      );

      return resultados;
    }
  },

  Mutation: {
    crearAgenda: async (_, { especialidades, horarios_disponibles }, context) => {

      if (!context.user) {
        throw new AuthenticationError("No autorizado. Token inválido o ausente.");
      }
      // Solo médicos pueden consultar su propia agenda
      if (context.user.role !== "medico") {
        throw new AuthenticationError("Solo los médicos pueden acceder.");
      }
      const medico_id = context.user.id;
      const horariosValidados = validarHorarios(horarios_disponibles);

      // Validar que todas las especialidades existen
      const especialidadesEncontradas = await Especialidad.find({
        _id: { $in: especialidades }
      });

      if (especialidadesEncontradas.length !== especialidades.length) {
        throw new Error("Una o más especialidades no existen.");
      }

      const nuevaAgenda = new Agenda({
        medico_id,
        especialidades,
        horarios_disponibles: horariosValidados,
      });
      await nuevaAgenda.save();
      return await Agenda.findById(nuevaAgenda._id).populate("especialidades");
    },
  },
};

module.exports = agendaResolvers;