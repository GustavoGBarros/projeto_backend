const Projeto = require('../models/Projeto');
const PalavraChave = require('../models/PalavraChave');
const ConhecimentoRelacional = require('../models/ConhecimentoRelacional');
const Usuario = require('../models/Usuario');

exports.renderizarPaginaPrincipal = async (req, res, next) => {
  try {
    const termoBusca = req.query.search || '';
    let filtro = {};
    if (termoBusca) {
      const regex = new RegExp(termoBusca, 'i');
      const palavrasChaveIds = await PalavraChave.find({ nome: regex }).select('_id');
      filtro = {
        $or: [
          { nome: regex },
          { palavrasChave: { $in: palavrasChaveIds } }
        ]
      };
    }
    const projetos = await Projeto.find(filtro)
      .populate('desenvolvedores', 'nome email _id')
      .populate('palavrasChave', 'nome')
      .sort({ createdAt: -1 });
      
    const totalAlunos = await Usuario.countDocuments({ perfil: 'aluno' });
    let relatorio = [];
    if (totalAlunos > 0) {
      const contagemDominio = await Usuario.aggregate([
        { $match: { perfil: 'aluno' } },
        { $unwind: '$conhecimentos' },
        { $match: { 'conhecimentos.nivel': { $gte: 7 } } },
        { $group: { _id: '$conhecimentos.conhecimentoId', alunosQueDominam: { $sum: 1 } } }
      ]);
      const todosConhecimentos = await ConhecimentoRelacional.findAll();
      relatorio = todosConhecimentos.map(conhecimento => {
        const infoContagem = contagemDominio.find(item => item._id === conhecimento.id);
        const alunosQueDominam = infoContagem ? infoContagem.alunosQueDominam : 0;
        return {
          id: conhecimento.id,
          nome: conhecimento.nome,
          alunosQueDominam: alunosQueDominam,
          totalAlunos: totalAlunos,
          proporcao: totalAlunos > 0 ? (alunosQueDominam / totalAlunos) : 0
        };
      });
    }

    res.render('index', {
      titulo: 'Portfólio de Projetos', 
      projetos: projetos,
      relatorio: relatorio,
      searchTerm: termoBusca
    });
    
  } catch (erro) {
    console.error("Erro ao renderizar página principal:", erro);
    next(erro);
  }
};

exports.listarTodosProjetos = async (req, res, next) => {
  try {
    const termoBusca = req.query.search;
    let filtro = {};
    if (termoBusca) {
      const regex = new RegExp(termoBusca, 'i');
      const palavrasChaveIds = await PalavraChave.find({ nome: regex }).select('_id');
      filtro = { $or: [{ nome: regex }, { palavrasChave: { $in: palavrasChaveIds } }] };
    }
    const projetos = await Projeto.find(filtro)
      .populate('desenvolvedores', 'nome email _id')
      .populate('palavrasChave', 'nome')
      .sort({ createdAt: -1 });
    res.json(projetos);
  } catch (erro) { next(erro); }
};

exports.filtrarProjetosPorPalavraChave = async (req, res, next) => {
  try {
    const palavraChave = await PalavraChave.findOne({ nome: req.query.palavra });
    if (!palavraChave) { return res.json([]); }
    const projetos = await Projeto.find({ palavrasChave: palavraChave._id })
      .populate('desenvolvedores', 'nome email')
      .populate('palavrasChave', 'nome');
    res.json(projetos);
  } catch (erro) { next(erro); }
};

exports.listarPalavrasChavePublico = async (req, res, next) => {
  try {
    const palavrasChave = await PalavraChave.find({});
    res.json(palavrasChave);
  } catch (erro) { next(erro); }
};

exports.listarConhecimentosPublico = async (req, res, next) => {
  try {
    const conhecimentos = await ConhecimentoRelacional.findAll();
    res.json(conhecimentos);
  } catch (erro) { next(erro); }
};

exports.obterProjetoPorId = async (req, res, next) => {
  try {
    const projeto = await Projeto.findById(req.params.id)
      .populate('desenvolvedores', 'nome email _id')
      .populate('palavrasChave', 'nome');
    if (!projeto) { return res.status(404).json({ mensagem: 'Projeto não encontrado.' }); }
    res.json(projeto);
  } catch (erro) { next(erro); }
};

exports.listarAlunosPublico = async (req, res, next) => {
  try {
    const alunos = await Usuario.find({ perfil: 'aluno' }).select('nome _id');
    res.json(alunos);
  } catch (erro) { next(erro); }
};

exports.obterRelatorioDominioConhecimentos = async (req, res, next) => {
  try {
    const totalAlunos = await Usuario.countDocuments({ perfil: 'aluno' });
    if (totalAlunos === 0) { return res.json([]); }
    const contagemDominio = await Usuario.aggregate([ /* ... aggregate ... */ ]);
    const todosConhecimentos = await ConhecimentoRelacional.findAll();
    const relatorio = todosConhecimentos.map(conhecimento => { /* ... map ... */ });
    res.json(relatorio);
  } catch (erro) { next(erro); }
};
