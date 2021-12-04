import { ModeloAvance } from './avance.js';

const resolversAvance = {
  Query: {
    Avances: async (parent, args) => {
      const avances = await ModeloAvance.find()
        .populate('proyecto')
        .populate('creadoPor');
      return avances;
    },
    filtrarAvance: async (parents, args) => {
      const avanceFiltrado = await ModeloAvance.find({ proyecto: args._id })
        .populate('proyecto')
        .populate('creadoPor');
      return avanceFiltrado;
    },
  },
  Mutation: {
    crearAvance: async (parents, args) => {
      const avanceCreado = ModeloAvance.create({
        fecha: args.fecha,
        descripcion: args.descripcion,
        proyecto: args.proyecto,
        creadoPor: args.creadoPor,
        observaciones: args.observaciones,
      });
      return avanceCreado;
    },

    editarAvance: async (parent, args) => {
      const avanceEditado = await ModeloAvance.findByIdAndUpdate(
        args._id,
        { ...args.campos },
        { new: true }
      );
      return avanceEditado;
    },

    crearObservacion: async (parent, args) => {
      const avanceConObservacion = await ModeloAvance.findByIdAndUpdate(
        args.idAvance,
        {
          $addToSet: {
            observaciones: { ...args.campos },
          },
        },
        { new: true }
      );

      return avanceConObservacion;
    },

    editarObservacion: async (parent, args) => {
      const avanceEditado = await ProjectModel.findByIdAndUpdate(
        args.idAvance,
        {
          $set: {
            [`observaciones.${args.indexObservacion}.descripcion`]:
              args.campos.descripcion,
          },
        },
        { new: true }
      );
      return avanceEditado;
    },


    eliminarObservacion: async (parent, args) => {
      const avanceObservacion = await ProjectModel.findByIdAndUpdate(
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
      return avanceObservacion;
    },
  },
};

export { resolversAvance };
