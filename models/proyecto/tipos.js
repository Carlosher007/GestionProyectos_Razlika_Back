import { gql } from 'apollo-server-express';

const tiposProyecto = gql`
  type Objetivo {
    _id: ID!
    descripcion: String!
    tipo: Enum_TipoObjetivo!
  }

  input crearObjetivo {
    descripcion: String!
    tipo: Enum_TipoObjetivo!
  }

  input camposObjetivo {
    descripcion: String!
    tipo: Enum_TipoObjetivo!
  }

  input camposEditarObjetivo {
    descripcion: String
    tipo: Enum_TipoObjetivo
  }

  input camposProyecto {
    nombre: String
    presupuesto: Float
    fechaInicio: Date
    fechaFin: Date
    estado: Enum_EstadoProyecto
    fase: Enum_FaseProyecto
    lider: String
  }

  input camposEstadoProyecto {
    estado: Enum_EstadoProyecto
  }

  input camposFaseProyecto {
    fase: Enum_FaseProyecto
  }

  type Proyecto {
    _id: ID!
    nombre: String!
    presupuesto: Float!
    fechaInicio: Date!
    fechaFin: Date!
    estado: Enum_EstadoProyecto!
    fase: Enum_FaseProyecto!
    lider: Usuario!
    objetivos: [Objetivo]
    avances: [Avance]
    inscripciones: [Inscripcion]
  }

  type Query {
    ProyectosBasico: ResponseList
    Proyecto(_id: String!): Response
    ProyectosConTodo: ResponseList
    ProyectoConTodo(_id: String!): Response
  }

  type Mutation {
    crearProyecto(
      nombre: String!
      presupuesto: Float!
      fechaInicio: Date!
      fechaFin: Date!
      estado: Enum_EstadoProyecto!
      fase: Enum_FaseProyecto!
      lider: String!
      objetivos: [crearObjetivo]
    ): Response

  type Error {
    path: String!
    message: String!
  }

  type Response {
    succes: Boolean!
    errors: [Error]
    proyecto: Proyecto
  }

  type ResponseList {
    succes: Boolean!
    errors: [Error]
    proyecto: [Proyecto]
  }



    editarProyecto(_id: String!, campos: camposProyecto!): Response

    eliminarProyecto(_id: String, nombre: String): Response

    crearObjetivo(idProyecto: String!, campos: camposObjetivo!): Response

    editarObjetivo(
      idProyecto: String!
      indexObjetivo: Int!
      campos: camposEditarObjetivo!
    ): Response

    eliminarObjetivo(idProyecto: String!, idObjetivo: String!): Response
  }
`;

export { tiposProyecto };
