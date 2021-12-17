import { gql } from 'apollo-server-express';

const tiposUsuario = gql`
  input camposUsuario {
    nombre: String!
    apellido: String!
    identificacion: String!
    correo: String!
    rol: Enum_Rol!
    estado: Enum_EstadoUsuario
    password: String!
  }

  input editarUsuario {
    nombre: String
    apellido: String
    identificacion: String
    correo: String
    estado: Enum_EstadoUsuario
    password: String
    foto: String
  }

  input editarEstado {
    estado: Enum_EstadoUsuario
  }

  type Usuario {
    _id: ID!
    nombre: String!
    apellido: String!
    identificacion: String!
    correo: String!
    rol: Enum_Rol!
    estado: Enum_EstadoUsuario
    foto:String
    inscripciones: [Inscripcion]
    avancesCreados: [Avance]
    proyectosLiderados: [Proyecto]
  }

  input FiltroUsuarios {
    _id: ID
    identificacion: String
    correo: String
    rol: Enum_Rol
    estado: Enum_EstadoUsuario
  }

  type Query {
    Usuarios(filtro: FiltroUsuarios): ResponseList!
    UsuariosBasico: ResponseList!
    Usuario(_id: String!): Response!
    UsuariosConTodo: ResponseList!
    UsuarioConTodo(_id: String!): Response!
    UsuariosBasicoAdmin(_id: String!): ResponseList!
    Estudiantes: ResponseList!
    EstudiantesLider(_id: String!): ResponseList!
  }

  type Error {
    path: String!
    message: String!
  }

  type Response {
    succes: Boolean!
    errors: [Error]
    usuario: Usuario
  }

  type ResponseList {
    succes: Boolean!
    errors: [Error]
    usuario: [Usuario]
  }

  type Mutation {
    crearUsuario(
      nombre: String!
      apellido: String!
      identificacion: String!
      correo: String!
      rol: Enum_Rol!
      estado: Enum_EstadoUsuario
      password: String!
    ): Response!

    editarUsuario(_id: String!, campos: editarUsuario): Response!

    editarUsuarioD(
      _id: String
      nombre: String
      apellido: String
      identificacion: String
      correo: String
      estado: Enum_EstadoUsuario
    ): Response!

    editarUsuarioAdministrador(
      _idUsuario: String!
      _id: String
      campos: editarUsuario
    ): Response!

    editarUsuarioLider(
      _idUsuario: String!
      _id: String
      campos: editarUsuario
    ): Response!

    eliminarUsuario(_id: String, correo: String): Response!
  }
`;

export { tiposUsuario };

// crearUsuario(
//     nombre: String!
//     apellido: String!
//     identificacion: String!
//     correo: String!
//     rol: Enum_Rol!
//     estado: Enum_EstadoUsuario
//     password: String!
//   ): Usuario
