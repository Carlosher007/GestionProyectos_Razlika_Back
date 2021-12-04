import { gql } from 'apollo-server-express';

const tiposProyecto = gql`
  type Proyecto {
    _id: ID!
    nombre: String!
    objGeneral: String!
    objEspecificos: String!
    presupuesto: Float!
    fechaInicio: Date!
    fechaFin: Date!
    estado: Enum_EstadoProyecto
    fase: Enum_FaseProyecto
    lider: Usuario!
    avances: [Avance]
    inscripciones: [Inscripcion]
  }
  type Query {
    # lider, admin y estudiante pueden ver los proyectos
    Proyectos: [Proyecto]
    Proyecto(_id: String!): Proyecto
  }
  type Mutation {
    #CREATE
    # lideres crean proyectos
    crearProyecto(
      nombre: String!
      objGeneral: String!
      objEspecificos: String!
      presupuesto: Float!
      fechaInicio: Date!
      fechaFin: Date!
      lider: String! # estado: Enum_EstadoProyecto # fase: Enum_FaseProyecto
    ): Proyecto
    #UPDATE
    # lideres actualizan proyectos
    editarProyecto(
      _id: String!
      nombre: String!
      objGeneral: String!
      objEspecificos: String!
      presupuesto: Float!
      fechaInicio: Date!
      fechaFin: Date!
    ): Proyecto
    # admin aprueba los proyectos creados actualizando su estado
    aprobarProyecto(
      _id: String!
      estado: Enum_EstadoProyecto
      fase: Enum_FaseProyecto
    ): Proyecto
    #Admin actualiza el estado del proyecto
    cambiarEstadoProyecto(_id: String!, estado: Enum_EstadoProyecto!): Proyecto
    #Admin actualiza el fase del proyecto
    cambiarFaseProyecto(_id: String!, fase: Enum_FaseProyecto!): Proyecto
    #DELETE
    eliminarProyecto(_id: String!): Proyecto
  }
`
export { tiposProyecto }