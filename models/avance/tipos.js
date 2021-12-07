import { gql } from 'apollo-server-express';

const tiposAvance = gql`
  type Observacion {
    _id: ID!
    descripcion: String!
  }

  input camposAvance {
    fecha: Date
    descripcion: String
  }

  input camposObservacion {
    descripcion: String!
  }

  input editarCamposObservacion {
    descripcion: String
  }

  type Avance {
    _id: ID!
    fecha: Date!
    descripcion: String!
    observaciones: [Observacion]
    proyecto: Proyecto!
    creadoPor: Usuario!
  }

  type Query {
    Avances: ResponseList
    filtrarAvance(_idProyecto: String!): ResponseList
  }

  type Error {
    path: String!
    message: String!
  }

  type Response {
    succes: Boolean!
    errors: [Error]
    avance: Avance
  }

  type ResponseList {
    succes: Boolean!
    errors: [Error]
    avance: [Avance]
  }

  type Mutation {
    crearAvance(
      fecha: Date!
      descripcion: String!
      proyecto: String!
      creadoPor: String!
    ): Response

    editarAvance(_id: String!, campos: camposAvance!): Response

    crearObservacion(idAvance: String!, campos: camposObservacion!): Response

    editarObservacion(
      idAvance: String!
      indexObservacion: Int!
      campos: editarCamposObservacion!
    ): Response

    eliminarObservacion(idAvance: String!, idObservacion: String!): Response
  }
`;

export { tiposAvance };
