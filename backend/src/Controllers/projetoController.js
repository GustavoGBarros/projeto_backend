const Projeto = require('../models/Projeto');
const Usuario = require('../models/Usuario');
const ConhecimentoRelacional = require('../models/ConhecimentoRelacional');

exports.criarProjeto = async (req, res, next) => {
  const { nome, resumo, link, palavrasChave, outrosDevsIds } = req.body;
  try {
    const idsDesenvolvedores = [req.usuario._id, ...(outrosDevsIds || [])];
    const projeto = new Projeto({
      nome,
      resumo,
      link,
      desenvolvedores: [...new Set(idsDesenvolvedores)],
      palavrasChave,
    });
    const projetoCriado = await projeto.save();
    res.status(201).json(projetoCriado);
  } catch (erro) {
    next(erro);
  }
};

exports.atualizarProjeto = async (req, res, next) => {
  try {
    const projeto = await Projeto.findById(req.params.id);
    if (!projeto) {
      return res.status(404).json({ mensagem: 'Projeto não encontrado.' });
    }
    const ehDesenvolvedor = projeto.desenvolvedores.some(devId => devId.equals(req.usuario._id));
    const ehAdmin = req.usuario.perfil === 'admin';
    if (!ehDesenvolvedor && !ehAdmin) {
        return res.status(403).json({ mensagem: 'Acesso negado.' });
    }
    projeto.nome = req.body.name || projeto.nome;
    projeto.resumo = req.body.summary || projeto.resumo;
    projeto.link = req.body.link || projeto.link;
    if (req.body.keywords) {
        projeto.palavrasChave = req.body.keywords;
    }
    if (req.body.outrosDevsIds) {
        const idsDesenvolvedores = [req.usuario._id, ...req.body.outrosDevsIds];
        projeto.desenvolvedores = [...new Set(idsDesenvolvedores)];
    }
    const projetoAtualizado = await projeto.save();
    res.json(projetoAtualizado);
  } catch (erro) {
    next(erro);
  }
};

exports.excluirProjeto = async (req, res, next) => {
  try {
    const projeto = await Projeto.findById(req.params.id);
    if (!projeto) {
      return res.status(404).json({ mensagem: 'Projeto não encontrado.' });
    }
    const ehDesenvolvedor = projeto.desenvolvedores.some(devId => devId.equals(req.usuario._id));
    const ehAdmin = req.usuario.perfil === 'admin';
    if (!ehDesenvolvedor && !ehAdmin) {
        return res.status(403).json({ mensagem: 'Acesso negado.' });
    }
    await projeto.deleteOne();
    res.json({ mensagem: 'Projeto removido com sucesso.' });
  } catch (erro) {
    next(erro);
  }
};

exports.atualizarConhecimentosAluno = async (req, res, next) => {
  const { knowledges } = req.body;
  try {
    const aluno = await Usuario.findById(req.usuario._id);
    if (!aluno) {
      return res.status(404).json({ mensagem: 'Aluno não encontrado.' });
    }

    const dadosFormatados = knowledges.map(kn => ({
        conhecimentoId: parseInt(kn.knowledge, 10),
        nivel: parseInt(kn.level, 10)
    }));
    
    aluno.conhecimentos = dadosFormatados;
    await aluno.save();
    res.json(aluno.conhecimentos);
  } catch (erro) {
    next(erro);
  }
};

exports.obterConhecimentosAluno = async (req, res, next) => {
  try {
    const usuario = await Usuario.findById(req.usuario._id);
    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }
    const idsDosConhecimentos = usuario.conhecimentos.map(c => c.conhecimentoId);
    const conhecimentosRelacionais = await ConhecimentoRelacional.findAll({
      where: { id: idsDosConhecimentos }
    });
    const resultadoFinal = usuario.conhecimentos.map(uc => {
      const infoConhecimento = conhecimentosRelacionais.find(cr => cr.id === uc.conhecimentoId);
      return {
        conhecimento: infoConhecimento ? {
          _id: infoConhecimento.id,
          nome: infoConhecimento.nome
        } : null,
        level: uc.nivel
      };
    }).filter(item => item.conhecimento !== null);
    res.json(resultadoFinal);
  } catch (erro) {
    next(erro);
  }
};