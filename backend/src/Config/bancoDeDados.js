const mongoose = require('mongoose');

const conectarBancoDeDados = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB conectado com sucesso.');
  } catch (erro) {
    console.error(`Erro na conexão com o MongoDB: ${erro.message}`);
    process.exit(1);
  }
};

module.exports = conectarBancoDeDados;