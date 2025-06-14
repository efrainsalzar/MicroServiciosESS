const { AuthenticationError } = require("apollo-server-express");
const Especialidad = require("../models/especialidad");
const { logEvent } = require("../logs/logger");


const especialidad_resolvers = {
  Query: {
    getEspecialidades: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError("No autorizado. Token inválido o ausente.");
      }
      if (context.user.role !== "admin") {
        throw new AuthenticationError("Solo los adminitradores pueden acceder a esta agenda.");
      }
      try {
        return await Especialidad.find();
      } catch (error) {
        throw new Error(
          `Error al obtener las especialidades: ${error.message}`
        );
      }
    },
  },

  Mutation: {
    crearEspecialidad: async (_, { nombre, descripcion }, context) => {
      if (!context.user) {
        logEvent("Intento de crear especialidad sin token", "Anónimo");
        throw new AuthenticationError("No autorizado. Token inválido o ausente.");
      }

      if (context.user.role !== "admin") {
        logEvent(`Acceso denegado a crearEspecialidad por rol: ${context.user.role}`, context.user.name);
        throw new AuthenticationError("Solo los administradores pueden acceder.");
      }

      try {
        const existente = await Especialidad.findOne({ nombre });
        if (existente) {
          logEvent(`Intento duplicado de crear especialidad: ${nombre}`, context.user.name);
          throw new Error(`Ya existe una especialidad con el nombre: ${nombre}`);
        }

        const nuevaEspecialidad = new Especialidad({ nombre, descripcion });
        await nuevaEspecialidad.save();
        logEvent(`Especialidad creada: ${nombre}`, context.user.name);
        return nuevaEspecialidad;
      } catch (error) {
        logEvent(`Error al crear especialidad: ${error.message}`, context.user.name);
        throw new Error(`Error al crear la especialidad: ${error.message}`);
      }
    },


    borrarEspecialidad: async (_, { id }, context) => {
      if (!context.user) {
        throw new AuthenticationError("No autorizado. Token inválido o ausente.");
      }
      if (context.user.role !== "admin") {
        throw new AuthenticationError("Solo los adminitradores pueden acceder a esta agenda.");
      }
      try {
        const especialidad = await Especialidad.findByIdAndDelete(id);
        if (!especialidad) {
          throw new Error(`No se encontró la especialidad con ID: ${id}`);
        }
        return especialidad;
      } catch (error) {
        throw new Error(
          `Error al borrar la especialidad con ID ${id}: ${error.message}`
        );
      }
    },
  },
};

module.exports = especialidad_resolvers;
