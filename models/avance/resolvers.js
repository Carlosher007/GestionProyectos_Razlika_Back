import { ModeloAvance } from './avance.js';
import { ProjectModel } from '../proyecto/proyecto.js';

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
    crearAvance: async (parents, args) => {
      const otherErrors = [];
      try {
        const avanceCreado = ModeloAvance.create({
          fecha: args.fecha,
          descripcion: args.descripcion,
          proyecto: args.proyecto,
          creadoPor: args.creadoPor,
          observaciones: args.observaciones,
        });
        if (otherErrors.length) {
          throw otherErrors;
        }
        return {
          succes: true,
          errors: [],
          avance: avanceCreado,
        };
      } catch (error) {
        return {
          succes: false,
          errors: formatErrors(error, otherErrors),
          avance: null,
        };
      }
    },

    editarAvance: async (parent, args) => {
      const otherErrors = [];
      try {
        const avanceEditado = await ModeloAvance.findByIdAndUpdate(
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
        const observacionEditado = await ProjectModel.findByIdAndUpdate(
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
          avance: observacionEditado,
        };
      } catch (error) {
        return {
          succes: false,
          errors: formatErrors(error, otherErrors),
          avance: null,
        };
      }
    },

    eliminarObservacion: async (parent, args) => {
      const otherErrors = [];
      try {
      const observacionEliminada = await ProjectModel.findByIdAndUpdate(
        { _id: args.idAvance },
        {
          $pull: {
            objetivos: {
              _id: args.idObservacion,
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
        avance: observacionEliminada,
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
