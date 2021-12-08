import { UserModel } from '../../models/usuario/usuario.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../../utils/tokenUtils.js';
import validate from 'mongoose-validator';

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

const resolversAutenticacion = {
  Mutation: {
    registro: async (parent, args) => {
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
        if (otherErrors.length) {
          throw otherErrors;
        }
        return {
          succes: true,
          token: generateToken({
            _id: usuarioCreado._id,
            nombre: usuarioCreado.nombre,
            apellido: usuarioCreado.apellido,
            identificacion: usuarioCreado.identificacion,
            correo: usuarioCreado.correo,
            rol: usuarioCreado.rol,
          }),
          errors: [],
        };
      } catch (error) {
        return {
          succes: false,
          token: null,
          errors: formatErrors(error, otherErrors),
        };
      }
    },

    login: async (parent, args) => {
      const otherErrors = [];
      try {
        const usuarioEcontrado = await UserModel.findOne({
          correo: args.correo,
        });
        if (usuarioEcontrado) {
          if (await bcrypt.compare(args.password, usuarioEcontrado.password)) {
            if (otherErrors.length) {
              console.log('other');
              throw otherErrors;
            }
            return {
              succes: true,
              token: generateToken({
                _id: usuarioEcontrado._id,
                nombre: usuarioEcontrado.nombre,
                apellido: usuarioEcontrado.apellido,
                identificacion: usuarioEcontrado.identificacion,
                correo: usuarioEcontrado.correo,
                rol: usuarioEcontrado.rol,
                errors: [],
              }),
            };
          }
        }
      } catch (error) {
        const uknownError = {};
        uknownError.path = 'email | password';
        uknownError.message = 'datos no validos';
        // console.log('1', uknownError);
        return {
          succes: false,
          token: null,
          errors: { uknownError },
        };
      }
    },

    refreshToken: async (parent, args, context) => {
      const otherErrors = [];
      try {
        if (!context.userData) {
          if (otherErrors.length) {
            throw otherErrors;
          }
          const uknownError = {};
          uknownError.path = 'token';
          uknownError.message = 'token no valido';
          return {
            succes: false,
            token: null,
            errors: [uknownError],
          };
          // return {
          //   error: 'token no valido',
          // };
        } else {
          if (otherErrors.length) {
            throw otherErrors;
          }
          return {
            succes: true,
            token: generateToken({
              _id: context.userData._id,
              nombre: context.userData.nombre,
              apellido: context.userData.apellido,
              identificacion: context.userData.identificacion,
              correo: context.userData.correo,
              rol: context.userData.rol,
            }),
            errors: [],
          };
        }
      } catch (error) {
        return {
          succes: false,
          token: null,
          errors: formatErrors(error, otherErrors),
        };
      }
      // valdiar que el contexto tenga info del usuario. si si, refrescar el token
      // si no devolver null para que en el front redirija al login.
    },
  },
};

export { resolversAutenticacion };
