const { gql } = require('apollo-server-express');

const especialidad_typeDefs = gql`
  """Representa una especialidad médica registrada en el sistema"""
  type Especialidad {
    """Identificador único de la especialidad"""
    id: ID!

    """Nombre de la especialidad (ej. Pediatría, Cardiología)"""
    nombre: String!

    """Descripción breve de la especialidad"""
    descripcion: String!
  }

  type Query {
    """Obtiene todas las especialidades disponibles en el sistema"""
    getEspecialidades: [Especialidad]
  }

  type Mutation {
    """
    Crea una nueva especialidad médica.

    Requiere nombre y descripción. Solo debe ser accesible para administradores.
    """
    crearEspecialidad(
      nombre: String!
      descripcion: String!
    ): Especialidad

    """
    Elimina una especialidad médica por ID.

    Idealmente, debería restringirse si la especialidad está en uso.
    """
    borrarEspecialidad(id: ID!): Especialidad
  }
`;

module.exports = especialidad_typeDefs;

/*
-------------------------------------------------------
query {
    getEspecialidades {
        id
        nombre
        descripcion
    }
}
-------------------------------------------------------
mutation {
    crearEspecialidad(
      nombre: "odontologia",     
      descripcion: "cosas de odontologia interna") {
        id
        nombre
        descripcion
    }
}
-------------------------------------------------------
mutation {
    borrarEspecialidad(id: null) {
        id
        nombre
        descripcion
    }
}
*/