import { UserModel } from './usuario.js';
import { ProjectModel } from '../proyecto/proyecto.js';
import { InscriptionModel } from '../inscripcion/inscripcion.js';
import bcrypt from 'bcrypt';

const formatErrors = (error, otherErrors) => {
  const errors = error.errors;
  let objErrors = [];
  if (errors) {
    Object.entries(errors).map((error) => {
      const { path, message } = error[1];
      objErrors.push({ path, message });
    });
    objErrors = objErrors.concat(otherErrors);
    return objErrors;
  } else if (otherErrors.length) {
    return otherErrors;
  }

  const uknownError = {};

  switch (error.code) {
    case 11000:
      uknownError.path = 'correo | id';
      uknownError.message = 'Hay un dato duplicado';
      break;
    default:
      uknownError.path = 'Desconocido';
      uknownError.message = error.message;
  }
  return [uknownError];
};

const resolversUsuario = {
  Query: {
    Usuarios: async (parent, args, context) => {
      const otherErrors = [];
      try {
        const usuarios = await UserModel.find({ ...args.filtro });
        if (otherErrors.length) {
          throw otherErrors;
        }
        return {
          succes: true,
          errors: [],
          usuario: usuarios,
        };
      } catch (error) {
        return {
          succes: false,
          errors: formatErrors(error, otherErrors),
          usuario: null,
        };
      }
    },
    UsuariosBasico: async (parent, args, context) => {
      const otherErrors = [];
      try {
        const Usuarios = await UserModel.find();
        if (otherErrors.length) {
          throw otherErrors;
        }
        return {
          succes: true,
          errors: [],
          usuario: Usuarios,
        };
      } catch (error) {
        return {
          succes: false,
          errors: formatErrors(error, otherErrors),
          usuario: null,
        };
      }
    },
    Estudiantes: async (parent, args, context) => {
      const otherErrors = [];
      try {
        const Usuarios = await UserModel.find({ rol: 'ESTUDIANTE' });
        if (otherErrors.length) {
          throw otherErrors;
        }
        return {
          succes: true,
          errors: [],
          usuario: Usuarios,
        };
      } catch (error) {
        return {
          succes: false,
          errors: formatErrors(error, otherErrors),
          usuario: null,
        };
      }
    },
    EstudiantesLider: async (parent, args, context) => {
      const otherErrors = [];
      try {
        const usuario = await UserModel.findOne({ _id: args._id });
        if (usuario.rol === 'LIDER') {
          const Usuarios = await UserModel.find({ rol: 'ESTUDIANTE' });
          if (otherErrors.length) {
            throw otherErrors;
          }
          return {
            succes: true,
            errors: [],
            usuario: Usuarios,
          };
        } else {
          const uknownError = {};
          uknownError.path = 'rol';
          uknownError.message = 'El rol no es valido';
          return {
            succes: false,
            errors: [uknownError],
            usuario: null,
          };
        }
      } catch (error) {
        return {
          succes: false,
          errors: formatErrors(error, otherErrors),
          usuario: null,
        };
      }
    },
    // ESTE ES UN EJEMPLO, PERO REALMENTE LAS VALIDACIONES DE ROL SE HARAN EN EL FRONT
    UsuariosBasicoAdmin: async (parent, args, context) => {
      const otherErrors = [];
      try {
        const usuario = await UserModel.findOne({ _id: args._id });
        // if (otherErrors.length) {
        //   throw otherErrors;
        // }
        if (usuario.rol === 'ADMINISTRADOR') {
          const Usuarios = await UserModel.find();
          return {
            succes: false,
            errors: [],
            usuario: Usuarios,
          };
        } else {
          const uknownError = {};
          uknownError.path = 'rol';
          uknownError.message = 'El rol no es valido';
          return {
            succes: false,
            errors: [uknownError],
            usuario: null,
          };
        }
      } catch (error) {
        return {
          succes: true,
          errors: [],
          usuario: null,
        };
      }
    },
    Usuario: async (parent, args) => {
      const otherErrors = [];
      try {
        const usuario = await UserModel.findOne({ _id: args._id });
        if (otherErrors.length) {
          throw otherErrors;
        }
        return {
          succes: true,
          errors: [],
          usuario: usuario,
        };
      } catch (error) {
        return {
          succes: false,
          errors: formatErrors(error, otherErrors),
          usuario: null,
        };
      }
    },
    UsuariosConTodo: async (parent, args, context) => {
      const otherErrors = [];
      try {
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

        if (otherErrors.length) {
          throw otherErrors;
        }
        return {
          succes: true,
          errors: [],
          usuario: usuarios,
        };
      } catch (error) {
        return {
          succes: false,
          errors: formatErrors(error, otherErrors),
          usuario: null,
        };
      }
    },
    UsuarioConTodo: async (parent, args, context) => {
      const otherErrors = [];
      try {
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

        if (otherErrors.length) {
          throw otherErrors;
        }
        return {
          succes: true,
          errors: [],
          usuario: usuario,
        };
      } catch (error) {
        return {
          succes: false,
          errors: formatErrors(error, otherErrors),
          usuario: null,
        };
      }
    },
  },
  Mutation: {
    crearUsuario: async (parent, args) => {
      const otherErrors = [];
      try {
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
        if (otherErrors.length) {
          throw otherErrors;
        }
        return {
          succes: true,
          errors: [],
          usuario: usuarioCreado,
        };
      } catch (error) {
        return {
          succes: false,
          errors: formatErrors(error, otherErrors),
          usuario: null,
        };
      }
    },

    editarUsuario: async (parent, args) => {
      const otherErrors = [];
      try {
        const usuarioEditado = await UserModel.findByIdAndUpdate(
          args._id,
          { ...args.campos },
          { new: true }
        );

        if (otherErrors.length) {
          throw otherErrors;
        }

        return {
          succes: true,
          errors: [],
          usuario: usuarioEditado,
        };
      } catch (error) {
        return {
          succes: false,
          errors: formatErrors(error, otherErrors),
          usuario: null,
        };
      }
    },

    editarUsuarioD: async (parent, args) => {
      const otherErrors = [];
      try {
        const usuarioEditado = await UserModel.findByIdAndUpdate(
          args._id,
          {
            nombre: args.nombre,
            apellido: args.apellido,
            identificacion: args.identificacion,
            correo: args.correo,
            estado: args.estado,
          },
          { new: true }
        );

        if (otherErrors.length) {
          throw otherErrors;
        }

        return {
          succes: true,
          errors: [],
          usuario: usuarioEditado,
        };
      } catch (error) {
        return {
          succes: false,
          errors: formatErrors(error, otherErrors),
          usuario: null,
        };
      }
    },

    editarUsuarioAdministrador: async (parent, args) => {
      const otherErrors = [];
      try {
        const usuario = await UserModel.findOne({ _id: args._id });
        if (usuario.rol === 'ADMINISTRADOR') {
          const usuarioEditado = await UserModel.findByIdAndUpdate(
            args._idUsuario,
            { ...args.campos },
            { new: true }
          );

          if (otherErrors.length) {
            throw otherErrors;
          }
          return {
            succes: true,
            errors: [],
            usuario: usuarioEditado,
          };
        } else {
          const uknownError = {};
          uknownError.path = 'rol';
          uknownError.message = 'El rol no es valido';
          return {
            succes: false,
            errors: [uknownError],
            usuario: null,
          };
        }
      } catch (error) {
        return {
          succes: false,
          errors: formatErrors(error, otherErrors),
          usuario: null,
        };
      }
    },

    editarUsuarioLider: async (parent, args) => {
      const otherErrors = [];
      try {
        const usuario = await UserModel.findOne({ _id: args._id });
        if (usuario.rol === 'LIDER') {
          const usuarioEditado = await UserModel.findByIdAndUpdate(
            args._idUsuario,
            { ...args.campos },
            { new: true }
          );

          if (otherErrors.length) {
            throw otherErrors;
          }
          return {
            succes: true,
            errors: [],
            usuario: usuarioEditado,
          };
        } else {
          const uknownError = {};
          uknownError.path = 'rol';
          uknownError.message = 'El rol no es valido';
          return {
            succes: false,
            errors: [uknownError],
            usuario: null,
          };
        }
      } catch (error) {
        return {
          succes: false,
          errors: formatErrors(error, otherErrors),
          usuario: null,
        };
      }
    },

    eliminarUsuario: async (parent, args) => {
      const otherErrors = [];
      try {
        if (Object.keys(args).includes('_id')) {
          const usuarioEliminado = await UserModel.findOneAndDelete({
            _id: args._id,
          });
          if (otherErrors.length) {
            throw otherErrors;
          }
          return {
            succes: true,
            errors: [],
            usuario: usuarioEliminado,
          };
        } else if (Object.keys(args).includes('correo')) {
          const usuarioEliminado = await UserModel.findOneAndDelete({
            correo: args.correo,
          });
          if (otherErrors.length) {
            throw otherErrors;
          }
          return {
            succes: true,
            errors: [],
            usuario: usuarioEliminado,
          };
        }
      } catch (error) {
        return {
          succes: false,
          errors: formatErrors(error, otherErrors),
          usuario: null,
        };
      }
    },
    // crearUsuario: async (parent, args) => {
    //   const salt = await bcrypt.genSalt(10);
    //   const hashedPassword = await bcrypt.hash(args.password, salt);
    //   const usuarioCreado = await UserModel.create({
    //     nombre: args.nombre,
    //     apellido: args.apellido,
    //     identificacion: args.identificacion,
    //     correo: args.correo,
    //     rol: args.rol,
    //     password: hashedPassword,
    //   });

    //   if (Object.keys(args).includes('estado')) {
    //     usuarioCreado.estado = args.estado;
    //   }

    //   return usuarioCreado;
    // },
  },
};

export { resolversUsuario };
