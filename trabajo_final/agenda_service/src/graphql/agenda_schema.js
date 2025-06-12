const { gql } = require("apollo-server-express");

const agenda_typeDefs = gql`
  """Enum que representa los días de la semana"""
  enum DiaSemana {
    DOMINGO  
    LUNES
    MARTES
    MIERCOLES
    JUEVES
    VIERNES
    SABADO
  }

  """Estructura que representa el horario disponible para un día específico"""
  type HorarioDia {
    """Día de la semana"""
    dia: DiaSemana!

    """Horas disponibles en formato HH:MM (ej: ["08:00", "09:00"])"""
    horas: [String!]!
  }

  """Agenda médica con especialidades y horarios disponibles"""
  type Agenda {
    """ID único de la agenda"""
    id: ID!

    """ID del médico propietario de esta agenda"""
    medico_id: Int!

    """Especialidades médicas asociadas a esta agenda"""
    especialidades: [Especialidad!]!  

    """Horarios disponibles agrupados por día"""
    horarios_disponibles: [HorarioDia!]!

    createdAt: String
    updatedAt: String
  }

  type Query {
    """Permite a un médico obtener su propia agenda (requiere token y rol 'medico')"""
    getMiAgenda: Agenda
    
    """Obtiene una lista de médicos disponibles según especialidad y fecha"""
    getMedicosDisponibles(
      especialidad: String!, 
      fecha: String!
    ): [Agenda]
  }

  type Mutation {
    """Permite a un médico crear su agenda con horarios y especialidades"""
    crearAgenda(
      especialidades: [String!]!
      horarios_disponibles: [HorarioDiaInput!]!
    ): Agenda
  }

  """Input para definir los horarios de un día"""
  input HorarioDiaInput {
    dia: DiaSemana!
    horas: [String!]!
  }
`;

module.exports = agenda_typeDefs;


/*
-------------------------------------------------------
query {
    getMiAgenda {
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
    especialidades: [
      "6848ba84550f75d57e9c0828",
      "6848ba84550f75d57e9c0829"
      ]
    horarios_disponibles: [
      { dia: MARTES, horas: ["14:00", "15:00", "16:00"] }
      { dia: JUEVES, horas: ["14:00", "15:00"] }
      { dia: SABADO, horas: ["10:00", "11:00"] }
    ]
  ) {
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
-------------------------------------------------------
 */