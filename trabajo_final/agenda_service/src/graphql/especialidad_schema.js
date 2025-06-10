const { gql } = require('apollo-server-express');

const especialidad_typeDefs = gql`
  type Especialidad {
    id: ID!
    nombre: String!
    descripcion: String!
  }

  type Query {
    getEspecialidades: [Especialidad]
  }

  type Mutation {
    crearEspecialidad(nombre: String!, descripcion: String!): Especialidad
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
    crearEspecialidad(nombre: null, descripcion: null) {
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