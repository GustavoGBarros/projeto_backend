const express = require('express');
const router = express.Router();
const { protegerRota } = require('../middlewares/autenticacaoMiddleware');
const { validacaoCriacaoProjeto } = require('../Middlewares/validacaoMiddleware');

const {
  criarProjeto,
  atualizarProjeto,
  excluirProjeto,
  atualizarConhecimentosAluno,
  obterConhecimentosAluno
} = require('../controllers/projetoController');
router.use(protegerRota);

router.route('/')
  .post(validacaoCriacaoProjeto, criarProjeto);

router.route('/:id')
  .put(atualizarProjeto)
  .delete(excluirProjeto);

router.route('/student/knowledges')
  .get(obterConhecimentosAluno)
  .put(atualizarConhecimentosAluno);

module.exports = router;