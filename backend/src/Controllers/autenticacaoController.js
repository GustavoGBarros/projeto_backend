const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

const gerarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.login = async (req, res, next) => {
  const { email, senha } = req.body;
  try {
    const usuario = await Usuario.findOne({ email });

    if (usuario && (await usuario.compararSenha(senha))) {
      res.json({
        _id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
        token: gerarToken(usuario._id),
      });
    } else {
      res.status(401).json({ mensagem: 'E-mail ou senha inválidos.' });
    }
  } catch (erro) {

    next(erro);
  }
};