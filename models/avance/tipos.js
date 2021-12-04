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
    observaciones: [Observacion]!
    proyecto: Proyecto!
    creadoPor: Usuario!
  }

  type Query {
    Avances: [Avance]
    filtrarAvance(_id: String!): [Avance]
  }
  type Mutation {
    crearAvance(
      fecha: Date!
      descripcion: String!
      proyecto: String!
      creadoPor: String!
      // observaciones: [crearObservacion]
    ): Avance

    editarAvance(_id: String!, campos: camposAvance!): Avance

    crearObservacion(idAvance: String!, campos: camposObservacion!): Avance

    editarObservacion(
      idAvance: String!
      indexObservacion: Int!
      campos: editarCamposObservacion!
    ): Avance

    eliminarObservacion(idAvance: String!, idObservacion: String!): Avance
  }
`;

export { tiposAvance };
