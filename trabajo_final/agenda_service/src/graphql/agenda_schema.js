const { gql } = require("apollo-server-express");

const agenda_typeDefs = gql`
  type HorarioDisponible {
    fecha: String!
    horas: [String!]!
  }

  type Agenda {
    id: ID!
    medico_id: Int!
    especialidades: [Especialidad!]!
    horarios_disponibles: [HorarioDisponible!]!
    createdAt: String
    updatedAt: String
  }

  type Query {
    getAgendas: [Agenda]
    getAgenda(id: ID!): Agenda
    getDisponibilidad(especialidad: String!, fecha: String!): [Agenda]
  }
    

  type Mutation {
    crearAgenda(
      medico_id: Int!
      especialidades: [String!]!
      horarios_disponibles: [HorarioInput!]!
    ): Agenda
    borrarAgenda(id: ID!): Agenda
  }

  input HorarioInput {
    fecha: String!
    horas: [String!]!
  }
`;

module.exports = agenda_typeDefs;

/*ejemplo */
/*
-------------------------------------------------------
query {
    getAgendas {
        id
        medico_id
        createdAt
        updatedAt
        especialidades {
            id
            nombre
            descripcion
        }
        horarios_disponibles {
            horas
        }
    }
}

-------------------------------------------------------

query {
    getAgenda(id: "6846098cffc930cfd1999b4f") {
        id
        medico_id
        createdAt
        updatedAt
    }
}
-------------------------------------------------------


mutation{
    crearAgenda(
    medico_id: 3
    especialidades: ["6845fa72dec0f4c0a5be8dc1", "6845fa7ddec0f4c0a5be8dc3", "6845fa8ddec0f4c0a5be8dc7"]
    horarios_disponibles: [
      {fecha: "2025-06-2", horas: ["08:00", "09:00", "11:00"] }
      {fecha: "2025-06-3", horas: ["14:00"] }
    ]
  ) {
    id
    medico_id
    especialidades {
      nombre
    }
    horarios_disponibles {
      horas
  }
}
}

-------------------------------------------------------

mutation {
    borrarAgenda(id: "68460d517a089bfa317e14e5") {
        id
        medico_id
        createdAt
        updatedAt
    }
}


*/
/**
-------------------------------------------------------

query {
  getDisponibilidad(especialidad: "Pediatría", fecha: "2025-06-03") {
    id
    medico_id
    especialidades {
      nombre
    }
    horarios_disponibles {
      fecha
      horas
    }
    createdAt
    updatedAt
  }
}


 */