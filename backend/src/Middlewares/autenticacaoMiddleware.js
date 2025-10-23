const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const protegerRota = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decodificado = jwt.verify(token, process.env.JWT_SECRET);

      req.usuario = await Usuario.findById(decodificado.id).select('-senha');
      
      next();
    } catch (erro) {
      console.error(erro);
      return res.status(401).json({ mensagem: 'Não autorizado, o token falhou.' });
    }
  }

  if (!token) {
    res.status(401).json({ mensagem: 'Não autorizado, token não encontrado.' });
  }
};

const ehAdmin = (req, res, next) => {
  if (req.usuario && req.usuario.perfil === 'admin') {
    next();
  } else {
    res.status(403).json({ mensagem: 'Acesso negado. Apenas administradores.' });
  }
};

module.exports = { protegerRota, ehAdmin };