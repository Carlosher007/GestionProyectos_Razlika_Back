import { ProjectModel } from './proyecto.js';
//
import { UserModel } from '../usuario/usuario.js';
import { ModeloAvance } from '../avance/avance.js';

import { InscriptionModel } from '../inscripcion/inscripcion.js';
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

  // ERROR CON PATH _id (HACER)
  switch (error.code) {
    case 11000:
      uknownError.path = 'nombre';
      uknownError.message = 'Hay un dato duplicado';
      break;
    default:
      uknownError.path = 'Desconocido';
      uknownError.message = error.message;
  }
  return [uknownError];
};

const resolversProyecto = {
  Proyecto: {
    lider: async (parent, args, context) => {
      const usr = await UserModel.findOne({
        _id: parent.lider.toString(),
      });
      return usr;
    },
    inscripciones: async (parent, args, context) => {
      const inscripciones = await InscriptionModel.find({
        proyecto: parent._id,
      });
      return inscripciones;
    },
    avances: async (parent, args, context) => {
      const avances = await ModeloAvance.find({
        proyecto: parent._id,
      });
      return avances;
    },
  },
  Query: {
    ProyectosBasico: async (parent, args, context) => {
      const otherErrors = [];
      try {
        const proyectos = await ProjectModel.find();
        if (otherErrors.length) {
          throw otherErrors;
        }
        return {
          succes: true,
          errors: [],
          proyecto: proyectos,
        };
      } catch (error) {
        return {
          succes: false,
          errors: formatErrors(error, otherErrors),
          proyecto: null,
        };
      }
    },
    ProyectosBasicoAdmin: async (parent, args, context) => {
      const otherErrors = [];
      try {
        if (context.userData) {
          if (context.userData.rol === 'ADMINISTRADOR') {
            const proyectos = await ProjectModel.find();
            if (otherErrors.length) {
              throw otherErrors;
            }
            return {
              succes: true,
              errors: [],
              proyecto: proyectos,
            };
          } else {
            const uknownError = {};
            uknownError.path = 'rol';
            uknownError.message = 'El rol no es valido';
            return {
              succes: false,
              errors: [uknownError],
              proyecto: null,
            };
          }
        } else {
          const uknownError = {};
          uknownError.path = 'token';
          uknownError.message = 'No hay token';
          return {
            succes: false,
            errors: [uknownError],
            proyecto: null,
          };
        }
      } catch (error) {
        return {
          succes: false,
          errors: formatErrors(error, otherErrors),
          proyecto: null,
        };
      }
    },
    //
    VerProyectosLidero: async (parent, args, context) => {
      const otherErrors = [];
      try {
        if (context.userData) {
          if (context.userData.rol === 'LIDER') {
            const proyectos = await ProjectModel.find({
              lider: context.userData._id,
            });
            if (otherErrors.length) {
              throw otherErrors;
            }
            return {
              succes: true,
              errors: [],
              proyecto: proyectos,
            };
          } else {
            const uknownError = {};
            uknownError.path = 'rol';
            uknownError.message = 'El rol no es valido';
            return {
              succes: false,
              errors: [uknownError],
              proyecto: null,
            };
          }
        } else {
          const uknownError = {};
          uknownError.path = 'token';
          uknownError.message = 'No hay token';
          return {
            succes: false,
            errors: [uknownError],
            proyecto: null,
          };
        }
      } catch (error) {
        return {
          succes: false,
          errors: formatErrors(error, otherErrors),
          proyecto: null,
        };
      }
    },
    VerProyectosEstudiante: async (parent, args, context) => {
      const otherErrors = [];
      try {
        if (context.userData) {
          if (context.userData.rol === 'ESTUDIANTE') {
            const proyectos = await ProjectModel.find().populate([
              // { path: 'lider' },
              { path: 'avances' },
              // { path: 'inscripciones', populate: { path: 'estudiante' } },
            ]);
            if (otherErrors.length) {
              throw otherErrors;
            }
            return {
              succes: true,
              errors: [],
              proyecto: proyectos,
            };
          } else {
            const uknownError = {};
            uknownError.path = 'rol';
            uknownError.message = 'El rol no es valido';
            return {
              succes: false,
              errors: [uknownError],
              proyecto: null,
            };
          }
        } else {
          const uknownError = {};
          uknownError.path = 'token';
          uknownError.message = 'No hay token';
          return {
            succes: false,
            errors: [uknownError],
            proyecto: null,
          };
        }
      } catch (error) {
        return {
          succes: false,
          errors: formatErrors(error, otherErrors),
          proyecto: null,
        };
      }
    },
    ProyectoConAvanceEstudiante: async (parent, args, context) => {
      const otherErrors = [];
      try {
        const usuario = await UserModel.findOne({ _id: args._id });
        if (usuario.rol === 'ESTUDIANTE') {
          const proyecto = await ProjectModel.findOne({
            _id: args._idProyecto,
          }).populate([{ path: 'avances', populate: [{ path: 'creadoPor' }] }]);
          if (otherErrors.length) {
            throw otherErrors;
          }
          return {
            succes: true,
            errors: [],
            proyecto: proyecto,
          };
        } else {
          const uknownError = {};
          uknownError.path = 'rol';
          uknownError.message = 'El rol no es valido';
          return {
            succes: false,
            errors: [uknownError],
            proyecto: null,
          };
        }
      } catch (error) {
        return {
          succes: false,
          errors: formatErrors(error, otherErrors),
          proyecto: null,
        };
      }
    },
    VerProyectosLideroActivo: async (parent, args, context) => {
      const otherErrors = [];
      try {
        if (context.userData) {
          if (context.userData.rol === 'LIDER') {
            const proyectos = await ProjectModel.find({
              lider: usuario._id,
              estado: 'ACTIVO',
            }).populate([{ path: 'lider' }]);
            if (otherErrors.length) {
              throw otherErrors;
            }
            return {
              succes: true,
              errors: [],
              proyecto: proyectos,
            };
          } else {
            const uknownError = {};
            uknownError.path = 'rol';
            uknownError.message = 'El rol no es valido';
            return {
              succes: false,
              errors: [uknownError],
              proyecto: null,
            };
          }
        } else {
          const uknownError = {};
          uknownError.path = 'token';
          uknownError.message = 'No hay token';
          return {
            succes: false,
            errors: [uknownError],
            proyecto: null,
          };
        }
      } catch (error) {
        return {
          succes: false,
          errors: formatErrors(error, otherErrors),
          proyecto: null,
        };
      }
    },
    Proyecto: async (parent, args) => {
      const otherErrors = [];
      try {
        const proyecto = await ProjectModel.findOne({ _id: args._id })
          .populate('avances')
          .populate('inscripciones');
        if (otherErrors.length) {
          throw otherErrors;
        }
        return {
          succes: true,
          errors: [],
          proyecto: proyecto,
        };
      } catch (error) {
        return {
          succes: false,
          errors: formatErrors(error, otherErrors),
          proyecto: null,
        };
      }
    },
    ProyectosConTodo: async (parent, args, context) => {
      const otherErrors = [];
      try {
        const proyectos = await ProjectModel.find().populate([
          { path: 'lider' },
          { path: 'avances' },
          { path: 'inscripciones', populate: { path: 'estudiante' } },
        ]);

        if (otherErrors.length) {
          throw otherErrors;
        }
        return {
          succes: true,
          errors: [],
          proyecto: proyectos,
        };
      } catch (error) {
        return {
          succes: false,
          errors: formatErrors(error, otherErrors),
          proyecto: null,
        };
      }
    },
    ProyectoConTodo: async (parent, args, context) => {
      const otherErrors = [];
      try {
        const proyecto = await ProjectModel.findOne({
          _id: args._id,
        }).populate([
          { path: 'lider' },
          { path: 'avances' },
          { path: 'inscripciones', populate: { path: 'estudiante' } },
        ]);
        if (otherErrors.length) {
          throw otherErrors;
        }
        return {
          succes: true,
          errors: [],
          proyecto: proyecto,
        };
      } catch (error) {
        return {
          succes: false,
          errors: formatErrors(error, otherErrors),
          proyecto: null,
        };
      }
    },
  },
  Mutation: {
    crearProyecto: async (parent, args, context) => {
      const otherErrors = [];
      try {
        const proyectoCreado = await ProjectModel.create({
          nombre: args.nombre,
          fechaInicio: args.fechaInicio,
          fechaFin: args.fechaFin,
          presupuesto: args.presupuesto,
          lider: args.lider,
          objetivos: args.objetivos,
        });

        if (otherErrors.length) {
          throw otherErrors;
        }
        return {
          succes: true,
          errors: [],
          proyecto: proyectoCreado,
        };
      } catch (error) {
        return {
          succes: false,
          errors: formatErrors(error, otherErrors),
          proyecto: null,
        };
      }
    },
    crearProyectoLider: async (parent, args, context) => {
      const otherErrors = [];
      try {
        const usuario = await UserModel.findOne({ _id: args._id });
        if (usuario.rol === 'LIDER') {
          const proyectoCreado = await ProjectModel.create({
            nombre: args.nombre,
            fechaInicio: Date.now(),
            fechaFin: args.fechaFin,
            presupuesto: args.presupuesto,
            lider: usuario._id,
            objetivos: args.objetivos,
          });
          if (otherErrors.length) {
            throw otherErrors;
          }
          return {
            succes: true,
            errors: [],
            proyecto: proyectoCreado,
          };
        } else {
          const uknownError = {};
          uknownError.path = 'rol';
          uknownError.message = 'El rol no es valido';
          return {
            succes: false,
            errors: [uknownError],
            proyecto: null,
          };
        }
      } catch (error) {
        return {
          succes: false,
          errors: formatErrors(error, otherErrors),
          proyecto: null,
        };
      }
    },
    //
    editarProyecto: async (parent, args) => {
      const otherErrors = [];
      try {
        const proyectoEditado = await ProjectModel.findByIdAndUpdate(
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
          proyecto: proyectoEditado,
        };
      } catch (error) {
        return {
          succes: false,
          errors: formatErrors(error, otherErrors),
          proyecto: null,
        };
      }
    },
    editarProyectoAdministrador: async (parent, args) => {
      const otherErrors = [];
      try {
        const usuario = await UserModel.findOne({ _id: args._id });
        if (usuario.rol === 'ADMINISTRADOR') {
          const proyectoEditado = await ProjectModel.findByIdAndUpdate(
            args._idProyecto,
            { ...args.campos },
            { new: true }
          );
          if (otherErrors.length) {
            throw otherErrors;
          }
          return {
            succes: true,
            errors: [],
            proyecto: proyectoEditado,
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
          proyecto: null,
        };
      }
    },
    editarProyectoActivoLider: async (parent, args) => {
      const otherErrors = [];
      try {
        const usuario = await UserModel.findOne({ _id: args._id });
        if (usuario.rol === 'LIDER') {
          // LA IDEA ES MOSTRAR LOS ACTIVOS EN PANTALLA Y LUEGO EDITAR ESOS CON UN BOTON
          const proyectoEditado = await ProjectModel.findByIdAndUpdate(
            args._idProyecto,
            { ...args.campos },
            { new: true }
          );
          if (otherErrors.length) {
            throw otherErrors;
          }
          return {
            succes: true,
            errors: [],
            proyecto: proyectoEditado,
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
          proyecto: null,
        };
      }
    },
    eliminarProyecto: async (parent, args) => {
      const otherErrors = [];
      try {
        if (Object.keys(args).includes('_id')) {
          const proyectoEliminado = await ProjectModel.findOneAndDelete({
            _id: args._id,
          });
          return {
            succes: true,
            errors: formatErrors(error, otherErrors),
            proyecto: proyectoEliminado,
          };
        } else if (Object.keys(args).includes('nombre')) {
          const proyectoEliminado = await ProjectModel.findOneAndDelete({
            nombre: args.nombre,
          });
          return {
            succes: true,
            errors: formatErrors(error, otherErrors),
            proyecto: proyectoEliminado,
          };
        }
      } catch (error) {
        return {
          succes: false,
          errors: formatErrors(error, otherErrors),
          proyecto: null,
        };
      }
    },
    crearObjetivo: async (parent, args) => {
      const otherErrors = [];
      try {
        const proyectoConObjetivo = await ProjectModel.findByIdAndUpdate(
          args.idProyecto,
          {
            $addToSet: {
              objetivos: { ...args.campos },
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
          proyecto: proyectoConObjetivo,
        };
      } catch (error) {
        return {
          succes: false,
          errors: formatErrors(error, otherErrors),
          proyecto: null,
        };
      }
    },
    editarObjetivo: async (parent, args) => {
      const otherErrors = [];
      try {
        const proyectoEditado = await ProjectModel.findByIdAndUpdate(
          args.idProyecto,
          {
            $set: {
              [`objetivos.${args.indexObjetivo}.descripcion`]:
                args.campos.descripcion,
              [`objetivos.${args.indexObjetivo}.tipo`]: args.campos.tipo,
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
          proyecto: proyectoEditado,
        };
      } catch (error) {
        return {
          succes: false,
          errors: formatErrors(error, otherErrors),
          proyecto: null,
        };
      }
    },
    eliminarObjetivo: async (parent, args) => {
      const otherErrors = [];
      try {
        const proyectoObjetivo = await ProjectModel.findByIdAndUpdate(
          { _id: args.idProyecto },
          {
            $pull: {
              objetivos: {
                _id: args.idObjetivo,
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
          proyecto: proyectoObjetivo,
        };
      } catch (error) {
        return {
          succes: false,
          errors: formatErrors(error, otherErrors),
          proyecto: null,
        };
      }
    },
  },
};

export { resolversProyecto };
