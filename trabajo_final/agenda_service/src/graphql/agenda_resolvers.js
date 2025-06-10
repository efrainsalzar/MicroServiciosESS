const { AuthenticationError, UserInputError } = require("apollo-server-express");
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

const agendaResolvers = {
  Query: {
    getAgenda: async (_, { medico_id }, context) => {
      if (!context.user) {
        throw new AuthenticationError("No autorizado. Token inválido o ausente.");
      }
      // Solo médicos pueden consultar su propia agenda
      if (context.user.role !== "medico") {
        throw new AuthenticationError("Solo los médicos pueden acceder a esta agenda.");
      }
      // Solo puede acceder a su propia agenda
      if (parseInt(context.user.id) !== parseInt(medico_id)) {
        console.log(`Médico ${context.user.id} intentando acceder a agenda de ${medico_id}`);
        throw new AuthenticationError("No autorizado para ver la agenda de otro médico.");
      }
      const agenda = await Agenda.findOne({ medico_id }).populate("especialidades");
      if (!agenda) {
        throw new UserInputError(`No se encontró agenda para el médico con ID ${medico_id}`);
      }
      return agenda;
    },

    getMedicosDisponibles: async (_, { especialidad, fecha }, context) => {
      if (!context.user) {
        throw new AuthenticationError("No autorizado. Token inválido o ausente.");
      }
      // Solo médicos pueden consultar su propia agenda
      if (context.user.role !== "paciente") {
        throw new AuthenticationError("Solo los pacientes pueden acceder a esta agenda.");
      }

      const fechaValida = validarFecha(fecha);
      const diaSemana = obtenerDiaSemana(fechaValida);

      // Buscar todas las agendas con las especialidades pobladas
      const agendas = await Agenda.find().populate("especialidades");

      // Filtrar agendas que tengan la especialidad solicitada
      const agendasFiltradas = agendas.filter(agenda =>
        agenda.especialidades.some(e => e.nombre.toLowerCase() === especialidad.toLowerCase())
      );
      if (agendasFiltradas.length === 0) {
        throw new UserInputError(`No hay médicos de ${especialidad} registrados.`);
      }
      if (agendasFiltradas.length === 0) {
        throw new UserInputError(
          `No hay médicos de ${especialidad} disponibles el ${diaSemana} (${fechaValida})`
        );
      }

      return agendasFiltradas.map(agenda => ({
        medico_id: agenda.medico_id,
        especialidades: agenda.especialidades,
        horarios_disponibles: agenda.horarios_disponibles.filter(hd => hd.dia === diaSemana)
      }));
    },
  },

  Mutation: {
    crearAgenda: async (_, { medico_id, especialidades, horarios_disponibles }, context) => {

      if (!context.user) {
        throw new AuthenticationError("No autorizado. Token inválido o ausente.");
      }
      // Solo médicos pueden consultar su propia agenda
      if (context.user.role !== "medico") {
        throw new AuthenticationError("Solo los médicos pueden acceder.");
      }
      // Validar que el médico exista en el microservicio de usuarios
      const existe = await validarMedico(context.user.id);
      if (!existe) {
        throw new AuthenticationError("El médico autenticado no existe en el sistema.");
      }
      // Solo puede acceder a su propia agenda
      if (parseInt(context.user.id) !== parseInt(medico_id)) {
        throw new AuthenticationError("No autorizado para hacer cambios en la agenda de otro médico.");
      }

      const horariosValidados = validarHorarios(horarios_disponibles);

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