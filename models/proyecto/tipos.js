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
    ProyectosBasico: [Proyecto]
    Proyecto(_id: String!): Proyecto
    ProyectosConTodo: [Proyecto]
    ProyectoConTodo(_id: String!): Proyecto
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
    ): Proyecto

    editarProyecto(_id: String!, campos: camposProyecto!): Proyecto

    editarEstadoProyecto(_id: String!, campos: camposEstadoProyecto!): Proyecto

    editarFaseProyecto(_id: String!, campos: camposFaseProyecto!): Proyecto

    eliminarProyecto(_id: String, nombre: String): Proyecto

    crearObjetivo(idProyecto: String!, campos: camposObjetivo!): Proyecto

    editarObjetivo(
      idProyecto: String!
      indexObjetivo: Int!
      campos: camposEditarObjetivo!
    ): Proyecto

    eliminarObjetivo(idProyecto: String!, idObjetivo: String!): Proyecto
  }
`;

export { tiposProyecto };
