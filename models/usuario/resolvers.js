import { UserModel } from './usuario.js';
import bcrypt from 'bcrypt';

const resolversUsuario = {
  Query: {
    UsuariosBasico: async (parent, args, context) => {
      const Usuarios = await UserModel.find();
      return Usuarios;
    },
    // ESTE ES UN EJEMPLO, PERO REALMENTE LAS VALIDACIONES DE ROL SE HARAN EN EL FRONT
    UsuariosBasicoAdmin: async (parent, args, context) => {
      if (context.userData.rol === 'ADMINISTRADOR') {
        const Usuarios = await UserModel.find();
        return Usuarios;
      } else {
        return false;
      }
    },
    Usuario: async (parent, args) => {
      const usuario = await UserModel.findOne({ _id: args._id });
      return usuario;
    },
    // No esta funcionando
    ProyectosUsuario: async (parent, args, context) => {
      const usuarios = await UserModel.findOne({_id:args._id, }).populate([
        {
          path: 'proyectosLiderados',
        },
      ]);
      return usuarios;
    },
    UsuariosConTodo: async (parent, args, context) => {
      const usuarios = await UserModel.find().populate([
        {
          path: 'inscripciones',
          populate: {
            path: 'proyecto',
            populate: [{ path: 'lider' }, { path: 'avances' }],
          },
        },
        {
          path: 'proyectosLiderados',
        },
      ]);
      return usuarios;
    },
    UsuarioConTodo: async (parent, args, context) => {
      const usuario = await UserModel.findOne({ _id: args._id }).populate([
        {
          path: 'inscripciones',
          populate: {
            path: 'proyecto',
            populate: [{ path: 'lider' }, { path: 'avances' }],
          },
        },
        {
          path: 'proyectosLiderados',
        },
      ]);
      return usuario;
    },
  },
  Mutation: {
    crearUsuario: async (parent, args) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(args.password, salt);
      const usuarioCreado = await UserModel.create({
        nombre: args.nombre,
        apellido: args.apellido,
        identificacion: args.identificacion,
        correo: args.correo,
        rol: args.rol,
        password: hashedPassword,
      });

      if (Object.keys(args).includes('estado')) {
        usuarioCreado.estado = args.estado;
      }

      return usuarioCreado;
    },
    editarUsuario: async (parent, args) => {
      const usuarioEditado = await UserModel.findByIdAndUpdate(
        args._id,
        { ...args.campos },
        { new: true }
      );

      return usuarioEditado;
    },

    editarEstado: async (parent, args) => {
      const usuarioEditado = await UserModel.findByIdAndUpdate(
        args._id,
        { ...args.campos },
        { new: true }
      );

      return usuarioEditado;
    },

    eliminarUsuario: async (parent, args) => {
      if (Object.keys(args).includes('_id')) {
        const usuarioEliminado = await UserModel.findOneAndDelete({
          _id: args._id,
        });
        return usuarioEliminado;
      } else if (Object.keys(args).includes('correo')) {
        const usuarioEliminado = await UserModel.findOneAndDelete({
          correo: args.correo,
        });
        return usuarioEliminado;
      }
    },
  },
};

export { resolversUsuario };
