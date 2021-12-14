import { gql } from 'apollo-server-express';

const tiposInscripcion = gql`
  type Inscripcion {
    _id: ID!
    estado: Enum_EstadoInscripcion!
    fechaIngreso: Date
    fechaEgreso: Date
    proyecto(lider: String): Proyecto
    estudiante: Usuario!
  }

  type Query {
    Inscripciones: ResponseList!
    InscripcionesEstudiantes(_id: String!): ResponseList!
  }

  type Error {
    path: String!
    message: String!
  }

  type Response {
    succes: Boolean!
    errors: [Error]
    inscripcion: Inscripcion
  }

  type ResponseList {
    succes: Boolean!
    errors: [Error]
    inscripcion: [Inscripcion]
  }

  type Mutation {
    crearInscripcion(proyecto: String!, estudiante: String!): Response
    aprobarInscripcion(id: String!): Response
    rechazarInscripcion(id: String!): Response
  }
`;

export { tiposInscripcion };
