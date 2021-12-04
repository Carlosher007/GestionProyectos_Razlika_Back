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
    UsuariosBasico: [Usuario]
    Usuario(_id: String!): Usuario
    UsuariosConTodo: [Usuario]
    UsuarioConTodo(_id: String!): Usuario
    UsuariosBasicoAdmin: [Usuario]
    ProyectosUsuario(_id:String!):[Proyecto]
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
    ): Usuario

    editarUsuario(
      _id: String!
      campos: editarUsuario
    ): Usuario

    editarEstado(_id: String!, estado: editarEstado): Usuario

    eliminarUsuario(_id: String, correo: String): Usuario
  }
`;

export { tiposUsuario };
