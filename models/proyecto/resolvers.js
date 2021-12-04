import { ProjectModel } from './proyecto.js';

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
      const proyectos = await ProjectModel.find();
      return proyectos;
    },
    Proyecto: async (parent, args) => {
      const proyecto = await ProjectModel.findOne({ _id: args._id })
        .populate('avances')
        .populate('inscripciones');
      return proyecto;
    },
    ProyectosConTodo: async (parent, args, context) => {
      const proyectos = await ProjectModel.find().populate([
        { path: 'lider' },
        { path: 'avances' },
        { path: 'inscripciones', populate: { path: 'estudiante' } },
      ]);
      return proyectos;
    },
    ProyectoConTodo: async (parent, args, context) => {
      const proyectos = await ProjectModel.findOne({ _id: args._id }).populate([
        { path: 'lider' },
        { path: 'avances' },
        { path: 'inscripciones', populate: { path: 'estudiante' } },
      ]);
    },
  },
  Mutation: {
    crearProyecto: async (parent, args, context) => {
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
      return proyectoCreado;
    },
    editarProyecto: async (parent, args) => {
      const proyectoEditado = await ProjectModel.findByIdAndUpdate(
        args._id,
        { ...args.campos },
        { new: true }
      );
      return proyectoEditado;
    },
    crearObjetivo: async (parent, args) => {
      const proyectoConObjetivo = await ProjectModel.findByIdAndUpdate(
        args.idProyecto,
        {
          $addToSet: {
            objetivos: { ...args.campos },
          },
        },
        { new: true }
      );

      return proyectoConObjetivo;
    },
    editarObjetivo: async (parent, args) => {
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
      return proyectoEditado;
    },
    eliminarObjetivo: async (parent, args) => {
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
      return proyectoObjetivo;
    },
  },
};

export { resolversProyecto };
