import { InscriptionModel } from './inscripcion.js';

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
  },
  Mutation: {
    crearInscripcion: async (parent, args) => {
      const otherErrors = [];
      try {
        const inscripcionCreada = await InscriptionModel.create({
          fechaIngreso: args.fechaIngreso,
          fechaEgreso: args.fechaEgreso,
          estado: args.estado,
          proyecto: args.proyecto,
          estudiante: args.estudiante,
        });

        if (otherErrors.length) {
          throw otherErrors;
        }
        return {
          succes: true,
          errors: [],
          inscripcion: inscripcionCreada,
        };
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
