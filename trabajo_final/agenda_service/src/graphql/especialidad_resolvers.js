const Especialidad = require("../models/especialidad");

const especialidad_resolvers = {
  Query: {
    getEspecialidades: async () => {
      try {
        return await Especialidad.find();
      } catch (error) {
        throw new Error(
          `Error al obtener las especialidades: ${error.message}`
        );
      }
    },

    getEspecialidad: async (_, { id }) => {
      try {
        const especialidad = await Especialidad.findById(id);
        if (!especialidad) {
          throw new Error(`No se encontró la especialidad con ID: ${id}`);
        }
        return especialidad;
      } catch (error) {
        throw new Error(
          `Error al obtener la especialidad con ID ${id}: ${error.message}`
        );
      }
    },
  },

  Mutation: {
    crearEspecialidad: async (_, { nombre, descripcion }) => {
      try {
        const existente = await Especialidad.findOne({ nombre });
        if (existente) {
          throw new Error(
            `Ya existe una especialidad con el nombre: ${nombre}`
          );
        }

        const nuevaEspecialidad = new Especialidad({ nombre, descripcion });
        return await nuevaEspecialidad.save();
      } catch (error) {
        throw new Error(`Error al crear la especialidad: ${error.message}`);
      }
    },

    borrarEspecialidad: async (_, { id }) => {
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
