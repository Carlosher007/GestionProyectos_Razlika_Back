import mongoose from 'mongoose';
import { ProjectModel } from '../proyecto/proyecto.js';
import { UserModel } from '../usuario/usuario.js';
import validate from 'mongoose-validator';

const { Schema, model } = mongoose;

// interface Avance {
//   fecha: Date;
//   descripcion: string;
//   observaciones: [string];
//   proyecto: Schema.Types.ObjectId;
//   creadoPor: Schema.Types.ObjectId;
// }

const avanceSchema = new Schema({
  fecha: {
    type: Date,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
    validate: [
      validate({
        validator: 'isLength',
        arguments: [8, 20],
        message:
          'La descripcion debe contener entre {ARGS[0]} y {ARGS[1]} caracteres',
      }),
      validate({
        validator: 'isAlphanumeric',
        message: 'La descripcion debe ser alfanumerico',
      }),
    ],
  },
  observaciones: [
    {
      descripcion: {
        type: String,
        required: true,
        validate: [
          validate({
            validator: 'isLength',
            arguments: [8, 20],
            message:
              'La descripcion de la observacion debe contener entre {ARGS[0]} y {ARGS[1]} caracteres',
          }),
          validate({
            validator: 'isAlphanumeric',
            message: 'La descripcion de la observacion debe ser alfanumerico',
          }),
        ],
      },
    },
  ],
  proyecto: {
    type: Schema.Types.ObjectId,
    ref: ProjectModel,
    required: true,
  },
  creadoPor: {
    type: Schema.Types.ObjectId,
    ref: UserModel,
    required: true,
  },
});

const ModeloAvance = model('Avance', avanceSchema);

export { ModeloAvance };
