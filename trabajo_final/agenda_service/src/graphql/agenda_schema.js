const { gql } = require("apollo-server-express");

const agenda_typeDefs = gql`
  enum DiaSemana {
    DOMINGO  
    LUNES
    MARTES
    MIERCOLES
    JUEVES
    VIERNES
    SABADO

  }

  type HorarioDia {
    dia: DiaSemana!
    horas: [String!]!  # Formato "HH:MM" (ej: ["08:00", "09:00"])
  }

  type Agenda {
    id: ID!
    medico_id: Int!
    especialidades: [Especialidad!]!  
    horarios_disponibles: [HorarioDia!]!
    createdAt: String
    updatedAt: String
  }

  type Query {
    # Para médicos
    getAgenda(medico_id: ID!): Agenda
    
    # Para pacientes
    getMedicosDisponibles(especialidad: String!, fecha: String!): [Agenda]
  }

  type Mutation {
    # Para médicos
    crearAgenda(
      medico_id: Int!
      especialidades: [String!]!
      horarios_disponibles: [HorarioDiaInput!]!
    ): Agenda
  }

  input HorarioDiaInput {
    dia: DiaSemana!
    horas: [String!]!
  }
`;

module.exports = agenda_typeDefs;

/*
-------------------------------------------------------
query {
  getAgenda(medico_id: 3) {
    id
    medico_id
    especialidades {
      nombre
    }
    horarios_disponibles {
      dia
      horas
    }
  }
}
-------------------------------------------------------
query {
  getMedicosDisponibles(
    especialidad: "Dermatologia", 
    fecha: "2025-06-11"
  ) {
    medico_id
    especialidades {
      nombre
    }
    horarios_disponibles {
      dia
      horas
    }
  }
}
-------------------------------------------------------
mutation {
  crearAgenda(
    medico_id: 3
    especialidades: ["6845fa92dec0f4c0a5be8dc9", "6845fa97dec0f4c0a5be8dcb"]
    horarios_disponibles: [
      { dia: MARTES, horas: ["14:00", "15:00", "16:00"] }
      { dia: JUEVES, horas: ["14:00", "15:00"] }
      { dia: SABADO, horas: ["10:00", "11:00"] }
    ]
  ) {
    id
    medico_id
    horarios_disponibles {
      dia
      horas
    }
  }
}

-------------------------------------------------------
-------------------------------------------------------
 */