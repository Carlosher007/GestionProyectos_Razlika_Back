import { InscriptionModel } from './inscripcion.js';
import { UserModel } from '../usuario/usuario.js';
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
      uknownError.path = 'desconocido';
      uknownError.message = 'Hay un dato duplicado';
      break;
    default:
      uknownError.path = 'Desconocido';
      uknownError.message = error.message;
  }
  return [uknownError];
};

const resolverInscripciones = {
  Inscripcion: {
    proyecto: async (parent, args, context) => {
      return await ProjectModel.findOne({ _id: parent.proyecto });
    },
    estudiante: async (parent, args, context) => {
      return await UserModel.findOne({ _id: parent.estudiante });
    },
  },
  Query: {
    Inscripciones: async (parent, args) => {
      const otherErrors = [];
      try {
        const inscripciones = await InscriptionModel.find();
        if (otherErrors.length) {
          throw otherErrors;
        }
        return {
          succes: true,
          errors: [],
          inscripcion: inscripciones,
        };
      } catch (error) {
        return {
          succes: false,
          errors: formatErrors(error, otherErrors),
          inscripcion: null,
        };
      }
    },
    InscripcionesEstudiantes: async (parent, args) => {
      const otherErrors = [];
      try {
        const usuario = await UserModel.findOne({ _id: args._id });
        if (usuario.rol === 'LIDER') {
          const inscripciones = await InscriptionModel.find();
          if (otherErrors.length) {
            throw otherErrors;
          }
          return {
            succes: true,
            errors: [],
            inscripcion: inscripciones,
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
          inscripcion: null,
        };
      }
    },
  },
  Mutation: {
    crearInscripcion: async (parent, args) => {
      const otherErrors = [];
      try {
        const usuario = await UserModel.findOne({ _id: args._id });
        if (usuario.rol === 'ESTUDIANTE') {
          const inscripcionCreada = await InscriptionModel.create({
            fechaIngreso: Date.now(),
            estado: args.estado,
            proyecto: args.proyecto,
            estudiante: usuario._id,
          });

          if (otherErrors.length) {
            throw otherErrors;
          }
          return {
            succes: true,
            errors: [],
            inscripcion: inscripcionCreada,
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
          inscripcion: null,
        };
      }
    },
    aprobarInscripcion: async (parent, args) => {
      const otherErrors = [];
      try {
        const inscripcionAprobada = await InscriptionModel.findByIdAndUpdate(
          args.id,
          {
            estado: 'ACEPTADO',
            fechaIngreso: Date.now(),
          },
          { new: true }
        );

        if (otherErrors.length) {
          throw otherErrors;
        }
        return {
          succes: true,
          errors: [],
          inscripcion: inscripcionAprobada,
        };
      } catch (error) {
        return {
          succes: false,
          errors: formatErrors(error, otherErrors),
          inscripcion: null,
        };
      }
    },
    rechazarInscripcion: async (parent, args) => {
      const otherErrors = [];
      try {
        const inscripcionRechazada = await InscriptionModel.findByIdAndUpdate(
          args.id,
          {
            estado: 'RECHAZADO',
            fechaIngreso: Date.now(),
          },
          { new: true }
        );
        if (otherErrors.length) {
          throw otherErrors;
        }
        return {
          succes: true,
          errors: [],
          inscripcion: inscripcionRechazada,
        };
      } catch (error) {
        return {
          succes: false,
          errors: formatErrors(error, otherErrors),
          inscripcion: null,
        };
      }
    },
  },
};

export { resolverInscripciones };
