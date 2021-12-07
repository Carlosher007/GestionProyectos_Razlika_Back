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
    rol: Enum_Rol
    estado: Enum_EstadoUsuario
    password: String
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
    inscripciones: [Inscripcion]
    avancesCreados: [Avance]
    proyectosLiderados: [Proyecto]
  }

  type Query {
    UsuariosBasico: ResponseList!
    Usuario(_id: String!): Response!
    UsuariosConTodo: ResponseList!
    UsuarioConTodo(_id: String!): Response!
    UsuariosBasicoAdmin: ResponseList!
    Estudiantes: ResponseList!
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
