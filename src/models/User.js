import mongoose from 'mongoose';

const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[#\$%&*@])[A-Za-z\d#\$%&*@]{8,}$/;

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      
      validate: {
        validator: function (v) {
          // si ya está hasheado (60+ chars con $2b$), omite regex
          if (typeof v === 'string' && v.startsWith('$2')) return true;
          return passwordRegex.test(v);
        },
        message:
          'El password debe tener mínimo 8 caracteres, 1 mayúscula, 1 dígito y 1 caracter especial (# $ % & * @).'
      }
    },

    phoneNumber: { type: String, required: true, trim: true },

    birthdate: { type: Date, required: true },

    url_profile: { type: String, default: '' },

    adress: { type: String, default: '' }, // (sic) usado tal como lo pediste

    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);
