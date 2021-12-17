import { ModeloAvance } from './avance.js';
import { ProjectModel } from '../proyecto/proyecto.js';
import { UserModel } from '../usuario/usuario.js';

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

const resolversAvance = {
  // Avance:{
  //   proyecto: async (parent, args, context) => {
  //     return await ProjectModel.findOne({ _id: parent.proyecto });
  //   },
  //   creadoPor: async (parent, args, context) => {
  //     return await UserModel.findOne({ _id: parent.estudiante });
  //   },
  // },
  Query: {
    Avances: async (parent, args) => {
      const otherErrors = [];
      try {
        const avances = await ModeloAvance.find()
          .populate('proyecto')
          .populate('creadoPor');

        if (otherErrors.length) {
          throw otherErrors;
        }
        return {
          succes: true,
          errors: [],
          avance: avances,
        };
      } catch (error) {
        return {
          succes: false,
          errors: formatErrors(error, otherErrors),
          avance: null,
        };
      }
    },
    filtrarAvance: async (parents, args) => {
      const otherErrors = [];
      try {
        const avanceFiltrado = await ModeloAvance.find({
          proyecto: args._idProyecto,
        })
          .populate('proyecto')
          .populate('creadoPor');
        if (otherErrors.length) {
          throw otherErrors;
        }
        return {
          succes: true,
          errors: [],
          avance: avanceFiltrado,
        };
      } catch (error) {
        return {
          succes: false,
          errors: formatErrors(error, otherErrors),
          avance: null,
        };
      }
    },
  },
  Mutation: {
    crearAvance: async (parents, args, context) => {
      const otherErrors = [];
      try {
        if (context.userData) {
          // if (true) {
          if (context.userData.rol === 'ESTUDIANTE') {
            // if (true) {
            const avanceCreado = await ModeloAvance.create({
              fecha: Date.now(),
              descripcion: args.descripcion,
              proyecto: args.proyecto,
              // creadoPor: '61b0dafae9dba48ec10a3163',
              creadoPor: context.userData._id,
            });
            if (otherErrors.length) {
              throw otherErrors;
            }
            return {
              succes: true,
              errors: [],
              avance: avanceCreado,
            };
          } else {
            const uknownError = {};
            uknownError.path = 'rol';
            uknownError.message = 'El rol no es valido';
            return {
              succes: false,
              errors: [uknownError],
              avance: null,
            };
          }
        } else {
          const uknownError = {};
          uknownError.path = 'token';
          uknownError.message = 'no hay token';
          return {
            succes: false,
            errors: [uknownError],
            avance: null,
          };
        }
      } catch (error) {
        return {
          succes: false,
          errors: formatErrors(error, otherErrors),
          avance: null,
        };
      }
    },
    eliminarAvance: async (parent, args) => {
      const otherErrors = [];
      try {
        if (Object.keys(args).includes('_id')) {
          const avanceEliminado = await ModeloAvance.findOneAndDelete({
            _id: args._id,
          });
          return {
            succes: true,
            errors: [],
            avance: avanceEliminado,
          };
        } else if (Object.keys(args).includes('nombre')) {
          const avanceEliminado = await ModeloAvance.findOneAndDelete({
            nombre: args.nombre,
          });
          return {
            succes: true,
            errors: [],
            avance: avanceEliminado,
          };
        }
      } catch (error) {
        return {
          succes: false,
          errors: formatErrors(error, otherErrors),
          avance: null,
        };
      }
    },

    editarAvance: async (parent, args,context) => {
      const otherErrors = [];
      try {
        if (context.userData) {
          if (context.userData.rol === 'ESTUDIANTE') {
            const avanceEditado = await ModeloAvance.findByIdAndUpdate(
              args._idAvance,
              { ...args.campos },
              { new: true }
            );
            if (otherErrors.length) {
              throw otherErrors;
            }
            return {
              succes: true,
              errors: [],
              avance: avanceEditado,
            };
          } else {
            const uknownError = {};
            uknownError.path = 'rol';
            uknownError.message = 'El rol no es valido';
            return {
              succes: false,
              errors: [uknownError],
              avance: null,
            };
          }
        } else {
          const uknownError = {};
          uknownError.path = 'token';
          uknownError.message = 'no hay token';
          return {
            succes: false,
            errors: [uknownError],
            avance: null,
          };
        }
      } catch (error) {
        return {
          succes: false,
          errors: formatErrors(error, otherErrors),
          avance: null,
        };
      }
    },

    crearObservacion: async (parent, args) => {
      const otherErrors = [];
      try {
        const avanceConObservacion = await ModeloAvance.findByIdAndUpdate(
          args.idAvance,
          {
            $addToSet: {
              observaciones: { ...args.campos },
            },
          },
          { new: true }
        );
        if (otherErrors.length) {
          throw otherErrors;
        }
        return {
          succes: true,
          errors: [],
          avance: avanceConObservacion,
        };
      } catch (error) {
        return {
          succes: false,
          errors: formatErrors(error, otherErrors),
          avance: null,
        };
      }
    },

    editarObservacion: async (parent, args) => {
      const otherErrors = [];
      try {
        const avanceEditado = await ModeloAvance.findByIdAndUpdate(
          args.idAvance,
          {
            $set: {
              [`observaciones.${args.indexObservacion}.descripcion`]:
                args.campos.descripcion,
            },
          },
          { new: true }
        );
        if (otherErrors.length) {
          throw otherErrors;
        }
        return {
          succes: true,
          errors: [],
          avance: avanceEditado,
        };
      } catch (error) {
        return {
          succes: false,
          errors: formatErrors(error, otherErrors),
          avance: null,
        };
      }
    },

    // NO FUNCIONA
    eliminarObservacion: async (parent, args) => {
      const otherErrors = [];
      try {
        const observacionEliminado = await ModeloAvance.findByIdAndUpdate(
          { _id: args.idAvance },
          {
            $pull: {
              observaciones: {
                _id: args.idOb,
              },
            },
          },
          { new: true }
        );
        if (otherErrors.length) {
          throw otherErrors;
        }
        return {
          succes: true,
          errors: [],
          avance: observacionEliminado,
        };
      } catch (error) {
        return {
          succes: false,
          errors: formatErrors(error, otherErrors),
          avance: null,
        };
      }
    },
  },
};

export { resolversAvance };
