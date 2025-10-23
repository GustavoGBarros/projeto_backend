const { body, validationResult } = require('express-validator');

const aplicarValidacao = (req, res, next) => {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    return res.status(400).json({ erros: erros.array() });
  }
  next();
};

const validacaoCriacaoAluno = [
  body('nome')
    .notEmpty().withMessage('O nome é obrigatório.')
    .isString().withMessage('O nome deve ser um texto.'),
  
  body('email')
    .isEmail().withMessage('Forneça um e-mail válido.')
    .normalizeEmail(),
  
  body('senha')
    .isLength({ min: 6 }).withMessage('A senha precisa ter no mínimo 6 caracteres.'),

  aplicarValidacao, 
];

const validacaoCriacaoProjeto = [
  body('nome').notEmpty().withMessage('O nome do projeto é obrigatório.'),
  body('resumo').notEmpty().withMessage('O resumo é obrigatório.'),
  body('link').isURL().withMessage('O link externo deve ser uma URL válida.'),

  aplicarValidacao,
];

const validacaoEntidadeSimples = [
  body('nome').notEmpty().withMessage('O nome é obrigatório.'),
  aplicarValidacao,
];


module.exports = {
  validacaoCriacaoAluno,
  validacaoCriacaoProjeto,
  validacaoEntidadeSimples, 
};
