const mongoose = require('mongoose');

const projetoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  resumo: { type: String, required: true },
  link: { type: String, required: true },
  desenvolvedores: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  }],
  palavrasChave: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PalavraChave',
  }],
}, { timestamps: true });

module.exports = mongoose.model('Projeto', projetoSchema);