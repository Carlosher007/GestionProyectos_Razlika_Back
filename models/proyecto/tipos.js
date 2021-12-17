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
  }

  input editarProyecto {
    nombre: String
    presupuesto: Float
    fechaInicio: Date
    fechaFin: Date
    estado: Enum_EstadoProyecto
    fase: Enum_FaseProyecto
  }

  input editarProyectoActivo {
    nombre: String
    presupuesto: Float
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
    ProyectosBasico: ResponseList!
    Proyecto(_id: String!): Response!
    ProyectosConTodo: ResponseList!
    ProyectoConTodo(_id: String!): Response!
    ProyectosBasicoAdmin: ResponseList!
    VerProyectosLidero: ResponseList!
    VerProyectosLideroActivo: ResponseList!
    VerProyectosEstudiante: ResponseList!
    ProyectoConAvanceEstudiante(_id: String, _idProyecto: String!): Response
  }

  type Error {
    path: String!
    message: String!
  }

  type Response {
    succes: Boolean!
    errors: [Error]
    proyecto: Proyecto
  }

  input camposObjetivod {
    descripcion: String
    tipo: Enum_TipoObjetivo
  }

  type ResponseList {
    succes: Boolean!
    errors: [Error]
    proyecto: [Proyecto]
  }

  type Mutation {
    crearProyecto(
      nombre: String!
      presupuesto: Float!
      fechaInicio: Date!
      fechaFin: Date!
      lider: String!
      objetivos: [crearObjetivo]
    ): Response

    crearProyectoLider(
      _id: String!
      nombre: String!
      presupuesto: Float!
      fechaFin: Date!
      objetivos: [crearObjetivo]
    ): Response

    editarProyecto(_id: String!, campos: camposProyecto): Response!

    editarProyectoAdministrador(
      _idProyecto: String!
      _id: String
      campos: editarProyecto
    ): Response!

    editarProyectoActivoLider(
      _idProyecto: String!
      _id: String
      campos: editarProyectoActivo
    ): Response!

    eliminarProyecto(_id: String, nombre: String): Response!

    crearObjetivo(idProyecto: String!, campos: camposObjetivo!): Response!

    editarObjetivo(
      idProyecto: String!
      indexObjetivo: Int!
      campos: camposObjetivod
    ): Response!

    eliminarObjetivo(idProyecto: String!, idObjetivo: String!): Response!
  }
`;

export { tiposProyecto };
