const mongoose = require('mongoose');

const palavraChaveSchema = new mongoose.Schema({
  nome: { type: String, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('PalavraChave', palavraChaveSchema);