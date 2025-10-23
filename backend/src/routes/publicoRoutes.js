const express = require('express');
const router = express.Router();

const {
  listarTodosProjetos,
  filtrarProjetosPorPalavraChave,
  listarPalavrasChavePublico,
  listarConhecimentosPublico,
  obterProjetoPorId,
  listarAlunosPublico,
  obterRelatorioDominioConhecimentos,
} = require('../controllers/publicoController');

router.get('/projetos', listarTodosProjetos);

router.get('/projetos/filter', filtrarProjetosPorPalavraChave);

router.get('/keywords', listarPalavrasChavePublico);

router.get('/knowledges', listarConhecimentosPublico);

router.get('/projetos/:id', obterProjetoPorId);

router.get('/alunos', listarAlunosPublico);

router.get('/report/dominance', obterRelatorioDominioConhecimentos);

module.exports = router;
