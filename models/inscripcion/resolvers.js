import { InscriptionModel } from './inscripcion.js';

const resolverInscripciones = {
  Query: {
    Inscripciones: async (parent, args) => {
      const inscripciones = await InscriptionModel.find();
      return inscripciones;
    },
  },
  Mutation: {
    crearInscripcion: async (parent, args) => {
      const inscripcionCreada = await InscriptionModel.create({
        fechaIngreso: args.fechaIngreso,
        fechaEgreso: args.fechaEgreso,
        estado: args.estado,
        proyecto: args.proyecto,
        estudiante: args.estudiante,
      });
      return inscripcionCreada;
    },
    aprobarInscripcion: async (parent, args) => {
      const inscripcionAprobada = await InscriptionModel.findByIdAndUpdate(
        args.id,
        {
          estado: 'ACEPTADO',
          fechaIngreso: Date.now(),
        },
        { new: true }
      );
      return inscripcionAprobada;
    },
    rechazarInscripcion: async (parent, args) => {
      const inscripcionRechazada = await InscriptionModel.findByIdAndUpdate(
        args.id,
        {
          estado: 'RECHAZADO',
          fechaIngreso: Date.now(),
        },
        { new: true }
      );
      return inscripcionRechazada;
    },
  },
};

export { resolverInscripciones };
