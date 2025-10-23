const express = require('express');
const router = express.Router();
const { criarUsuario } = require('../Controllers/adminController');
const { validacaoCriacaoAluno } = require('../Middlewares/validacaoMiddleware');

router.post('/primeiro-usuario', validacaoCriacaoAluno, criarUsuario);

module.exports = router;