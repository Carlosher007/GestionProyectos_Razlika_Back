import mongoose from 'mongoose';
const { Schema, model } = mongoose;
// import { Enum_Rol, Enum_EstadoUsuario } from '../enums/enums';
import validate from 'mongoose-validator';
// interface User {
//   correo: string;
//   identificacion: string;
//   nombre: string;
//   apellido: string;
//   rol: Enum_Rol;
//   estado: Enum_EstadoUsuario;
// }

const userSchema = new Schema({
  correo: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
      },
      // (email) => {
      //   if (email.includes('@') && email.includes('.')) {
      //     return true;
      //   } else {
      //     return false;
      //   }
      // },
      message: 'El formato del correo electrónico está malo.',
    },
  },
  password: {
    type: String,
    required: true,
  },
  identificacion: {
    type: String,
    required: true,
    unique: true,
  },
  nombre: {
    type: String,
    required: true,
    validate: [
      validate({
        validator: 'isLength',
        arguments: [2, 20],
        message:
          'El nombre de usuario debe contener entre {ARGS[0]} y {ARGS[1]} caracteres',
      }),
      validate({
        validator: 'isAlphanumeric',
        message: 'El nombre de usuario debe ser alfanumerico',
      }),
    ],
  },
  apellido: {
    type: String,
    required: true,
    validate: [
      validate({
        validator: 'isLength',
        arguments: [2, 20],
        message:
          'El apellido de usuario debe contener entre {ARGS[0]} y {ARGS[1]}',
      }),
      validate({
        validator: 'isAlphanumeric',
        message: 'El apellido de usuario debe ser alfanumerico',
      }),
    ],
  },
  rol: {
    type: String,
    required: true,
    enum: ['ESTUDIANTE', 'LIDER', 'ADMINISTRADOR'],
  },
  estado: {
    type: String,
    enum: ['PENDIENTE', 'AUTORIZADO', 'NO_AUTORIZADO'],
    default: 'PENDIENTE',
  },
});

userSchema.virtual('proyectosLiderados', {
  ref: 'Proyecto',
  localField: '_id',
  foreignField: 'lider',
});

userSchema.virtual('avancesCreados', {
  ref: 'Avance',
  localField: '_id',
  foreignField: 'creadoPor',
});

userSchema.virtual('inscripciones', {
  ref: 'Inscripcion',
  localField: '_id',
  foreignField: 'estudiante',
});

const UserModel = model('User', userSchema);

export { UserModel };
