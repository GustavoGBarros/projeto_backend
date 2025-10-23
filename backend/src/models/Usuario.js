const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const conhecimentoRelacionalSchema = new mongoose.Schema({
  conhecimentoId: {
    type: Number,
    required: true,
  },
  nivel: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },
}, { _id: false });

const usuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  perfil: {
    type: String,
    enum: ['aluno', 'admin'],
    default: 'aluno',
  },
  conhecimentos: [conhecimentoRelacionalSchema],
}, { timestamps: true });

usuarioSchema.pre('save', async function (next) {
  if (!this.isModified('senha')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
  next();
});

usuarioSchema.methods.compararSenha = async function (senhaEnviada) {
  return await bcrypt.compare(senhaEnviada, this.senha);
};

module.exports = mongoose.model('Usuario', usuarioSchema);