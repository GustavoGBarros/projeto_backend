// backend/src/routes/publicoRoutes.js (Versão Final - APENAS API Pública)
const express = require('express');
const router = express.Router();

// Importa as funções do controller (Certifique-se que o caminho está correto)
const {
  listarTodosProjetos,
  filtrarProjetosPorPalavraChave,
  listarPalavrasChavePublico,    // <<< GARANTA QUE ESTA É IMPORTADA
  listarConhecimentosPublico,  // <<< E ESTA
  obterProjetoPorId,
  listarAlunosPublico,
  obterRelatorioDominioConhecimentos,
} = require('../controllers/publicoController'); // Verifique se o nome da pasta é 'controllers'

// API para listar projetos (com busca opcional)
router.get('/projetos', listarTodosProjetos);

// API para filtrar projetos
router.get('/projetos/filter', filtrarProjetosPorPalavraChave);

// API para listar palavras-chave (usada pelo script.js nos modais)
// <<< GARANTA QUE ESTA ROTA EXISTE >>>
router.get('/keywords', listarPalavrasChavePublico);

// API para listar conhecimentos (usada pelo script.js nos modais)
// <<< GARANTA QUE ESTA ROTA EXISTE >>>
router.get('/knowledges', listarConhecimentosPublico);

// API para obter um projeto (usada pelo script.js ao editar)
router.get('/projetos/:id', obterProjetoPorId);

// API para listar alunos (usada pelo script.js nos modais)
router.get('/alunos', listarAlunosPublico);

// API para obter o relatório
router.get('/report/dominance', obterRelatorioDominioConhecimentos);

module.exports = router;