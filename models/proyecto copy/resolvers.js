import { ProjectModel } from './proyecto.js';

const resolversProyecto = {
  Query: {
    Proyectos: async (parent, args) => {
      const proyectos = await ProjectModel.find().populate('lider')
      return proyectos
    },
    Proyecto: async (parent, args) => {
      const Proyecto = await ProjectModel.findOne({ _id: args._id })
      return Proyecto
    },
  },

  Mutation: {
    crearProyecto: async (parent, args) => {
      const proyectoCreado = await ProjectModel.create({
        nombre: args.nombre,
        objGeneral: args.objGeneral,
        objEspecificos: args.objEspecificos,
        presupuesto: args.presupuesto,
        fechaInicio: args.fechaInicio,
        fechaFin: args.fechaFin,
        lider: args.lider,
      })
      return proyectoCreado
    },
    editarProyecto: async (parent, args) => {
      const proyectoEditado = await ProjectModel.findByIdAndUpdate(
        args._id,
        {
          nombre: args.nombre,
          objGeneral: args.objGeneral,
          objEspecificos: args.objEspecificos,
          presupuesto: args.presupuesto,
          fechaInicio: args.fechaInicio,
          fechaFin: args.fechaFin,
        },
        { new: true }
      )
      return proyectoEditado
    },
    aprobarProyecto: async (parent, args) => {
      const proyectoAprobado = await ProjectModel.findByIdAndUpdate(
        args._id,
        {
          estado: 'ACTIVO',
        },
        { new: true }
      )
      return proyectoAprobado
    },
    cambiarEstadoProyecto: async (parent, args) => {
      const estadoProyecto = await ProjectModel.findByIdAndUpdate(
        args._id,
        {
          estado: args.estado,
        },
        { new: true }
      )
      return estadoProyecto
    },
    cambiarFaseProyecto: async (parent, args) => {
      const estadoProyecto = await ProjectModel.findByIdAndUpdate(
        args._id,
        {
          fase: args.fase,
        },
        { new: true }
      )
      return estadoProyecto
    },
    eliminarProyecto: async (parent, args) => {
      const proyectoEliminado = await ProjectModel.findOneAndDelete({
        _id: args._id,
      })
      return proyectoEliminado
    },
  },
}

export { resolversProyecto }