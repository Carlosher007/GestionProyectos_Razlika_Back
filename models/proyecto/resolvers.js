import { ProjectModel } from './proyecto.js';
//

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
  // Proyecto: {
  //   lider: async (parent, args, context) => {
  //     const usr = await UserModel.findOne({
  //       _id: parent.lider.toString(),
  //     });
  //     return usr;
  //   },
  // },
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
          estado: args.estado,
          fase: args.fase,
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
    eliminarProyecto: async (parent, args) => {
      const otherErrors = [];
      try {
        if (Object.keys(args).includes('_id')) {
          const proyectoEliminado = await ProjectModel.findOneAndDelete({
            _id: args._id,
          });
          return proyectoEliminado;
        } else if (Object.keys(args).includes('nombre')) {
          const proyectoEliminado = await ProjectModel.findOneAndDelete({
            nombre: args.nombre,
          });
          return proyectoEliminado;
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
