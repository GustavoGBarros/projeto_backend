const express = require('express');
const router = express.Router();

const { protegerRota, ehAdmin } = require('../middlewares/autenticacaoMiddleware');
const { validacaoCriacaoAluno, validacaoEntidadeSimples } = require('../Middlewares/validacaoMiddleware');
const {
  criarUsuario,
  listarAlunos,
  obterAlunoPorId,
  atualizarAluno,
  excluirAluno,
  criarPalavraChave,
  listarPalavrasChave,
  atualizarPalavraChave,
  excluirPalavraChave,
  criarConhecimento,
  listarConhecimentos,
  atualizarConhecimento,
  excluirConhecimento
} = require('../Controllers/adminController');

router.use(protegerRota, ehAdmin);

router.route('/students')
  .post(validacaoCriacaoAluno, criarUsuario)
  .get(listarAlunos);

router.route('/students/:id')
  .get(obterAlunoPorId)
  .put(atualizarAluno)
  .delete(excluirAluno);

router.route('/keywords')
  .post(validacaoEntidadeSimples, criarPalavraChave)
  .get(listarPalavrasChave);

router.route('/keywords/:id')
  .put(validacaoEntidadeSimples, atualizarPalavraChave)
  .delete(excluirPalavraChave);

router.route('/knowledges')
  .post(validacaoEntidadeSimples, criarConhecimento)
  .get(listarConhecimentos);

router.route('/knowledges/:id')
  .put(validacaoEntidadeSimples, atualizarConhecimento)
  .delete(excluirConhecimento);

module.exports = router;