const Usuario = require('../models/Usuario');
const PalavraChave = require('../models/PalavraChave');
const ConhecimentoRelacional = require('../models/ConhecimentoRelacional');

exports.criarUsuario = async (req, res, next) => {
  const { nome, email, senha } = req.body;
  try {
    const usuarioJaExiste = await Usuario.findOne({ email });
    if (usuarioJaExiste) {
      return res.status(400).json({ mensagem: 'Este e-mail já está em uso.' });
    }
    const totalUsuarios = await Usuario.countDocuments();
    const perfil = totalUsuarios === 0 ? 'admin' : 'aluno';
    if (perfil === 'admin') {
        console.log("Banco de dados vazio. O primeiro usuário será criado como ADMINISTRADOR.");
    }
    const usuario = await Usuario.create({ nome, email, senha, perfil });
    res.status(201).json({ 
        _id: usuario._id, 
        nome: usuario.nome, 
        email: usuario.email,
        perfil: usuario.perfil
    });
  } catch (erro) {
    next(erro);
  }
};

exports.listarAlunos = async (req, res, next) => {
  try {
    const alunos = await Usuario.find({ perfil: 'aluno' }).select('-senha');
    res.json(alunos);
  } catch (erro) {
    next(erro);
  }
};

exports.obterAlunoPorId = async (req, res, next) => {
  try {
    const aluno = await Usuario.findById(req.params.id).select('-senha');
    if (!aluno) {
      return res.status(404).json({ mensagem: 'Aluno não encontrado.' });
    }
    res.json(aluno);
  } catch (erro) {
    next(erro);
  }
};

exports.atualizarAluno = async (req, res, next) => {
  try {
    const aluno = await Usuario.findById(req.params.id);
    if (!aluno) {
      return res.status(404).json({ mensagem: 'Aluno não encontrado.' });
    }
    aluno.nome = req.body.nome || aluno.nome;
    aluno.email = req.body.email || aluno.email;
    if (req.body.senha) {
      aluno.senha = req.body.senha;
    }
    const alunoAtualizado = await aluno.save();
    res.json({
      _id: alunoAtualizado._id,
      nome: alunoAtualizado.nome,
      email: alunoAtualizado.email,
    });
  } catch (erro) {
    next(erro);
  }
};

exports.excluirAluno = async (req, res, next) => {
  try {
    const aluno = await Usuario.findById(req.params.id);
    if (!aluno) {
      return res.status(404).json({ mensagem: 'Aluno não encontrado.' });
    }
    if (aluno.perfil !== 'aluno') {
        return res.status(400).json({ mensagem: 'Esta rota é apenas para excluir alunos.' });
    }
    await aluno.deleteOne();
    res.json({ mensagem: 'Aluno removido com sucesso.' });
  } catch (erro) {
    next(erro);
  }
};

exports.criarPalavraChave = async (req, res, next) => {
  try {
    const novaPalavra = await PalavraChave.create({ nome: req.body.nome });
    res.status(201).json(novaPalavra);
  } catch (erro) {
    if (erro.code === 11000) {
      return res.status(400).json({ mensagem: "Essa palavra-chave já existe." });
    }
    next(erro);
  }
};
exports.listarPalavrasChave = async (req, res, next) => {
  try {
    const lista = await PalavraChave.find({});
    res.json(lista);
  } catch (erro) {
    next(erro);
  }
};
exports.atualizarPalavraChave = async (req, res, next) => {
  try {
    const palavra = await PalavraChave.findByIdAndUpdate(req.params.id, { nome: req.body.nome }, { new: true });
    if (!palavra) {
      return res.status(404).json({ mensagem: 'Palavra-chave não encontrada.' });
    }
    res.json(palavra);
  } catch (erro) {
    next(erro);
  }
};
exports.excluirPalavraChave = async (req, res, next) => {
  try {
    const palavra = await PalavraChave.findById(req.params.id);
    if (!palavra) {
      return res.status(404).json({ mensagem: 'Palavra-chave não encontrada.' });
    }
    await palavra.deleteOne();
    res.json({ mensagem: 'Palavra-chave removida.' });
  } catch (erro) {
    next(erro);
  }
};

exports.criarConhecimento = async (req, res, next) => {
  try {
    const novoConhecimento = await ConhecimentoRelacional.create({ nome: req.body.nome });
    res.status(201).json(novoConhecimento);
  } catch (erro) {
    next(erro);
  }
};

exports.listarConhecimentos = async (req, res, next) => {
  try {
    const lista = await ConhecimentoRelacional.findAll();
    res.json(lista);
  } catch (erro) {
    next(erro);
  }
};

exports.atualizarConhecimento = async (req, res, next) => {
  try {
    const conhecimento = await ConhecimentoRelacional.findByPk(req.params.id);
    if (!conhecimento) {
      return res.status(404).json({ mensagem: 'Conhecimento não encontrado.' });
    }
    conhecimento.nome = req.body.nome;
    await conhecimento.save();
    res.json(conhecimento);
  } catch (erro) {
    next(erro);
  }
};

exports.excluirConhecimento = async (req, res, next) => {
  try {
    const conhecimento = await ConhecimentoRelacional.findByPk(req.params.id);
    if (!conhecimento) {
      return res.status(404).json({ mensagem: 'Conhecimento não encontrado.' });
    }
    await conhecimento.destroy();
    res.json({ mensagem: 'Conhecimento removido.' });
  } catch (erro) {
    next(erro);
  }
};