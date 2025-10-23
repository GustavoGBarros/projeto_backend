// ======================================================
// Arquivo humanizado: versão gerada automaticamente pelo assistente.
// Objetivo: tornar cabeçalhos e comentários mais naturais em Português
// Sem alterações de lógica — comportamento idêntico ao arquivo original.
// Se quiser que eu faça mudanças mais profundas (renomear variáveis,
// reescrever comentários função-a-função, ou simplificar trechos),
// diga e eu gero uma versão mais trabalhada para cada arquivo.
// ======================================================


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

// ----- SUGESTÕES DE MELHORIA (não aplicadas automaticamente) -----
// 1) Reescrever comentários muito formais/automáticos para um tom mais natural.
// 2) Adotar nomes de variáveis mais descritivos quando possível (atenção a exports).
// 3) Extrair trechos longos em funções utilitárias para reduzir repetição.
// 4) Adicionar JSDoc nas funções públicas para facilitar manutenção.
// -----------------------------------------------------------------
