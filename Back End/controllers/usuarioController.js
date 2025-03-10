const cryptoUtils = require('../utils/cryptoUtils');

function cadastrarUsuario(req, res) {
  const { nome, email, cpf, senha, data_nascimento, telefone1, telefone2, genero } = req.body;

  const senhaHash = cryptoUtils.hashSenha(senha);

  req.session.usuario = {
    nome,
    email,
    cpf,
    senha: senhaHash,
    data_de_nascimento: data_nascimento,
    telefone_1: telefone1,
    telefone_2: telefone2,
    genero
  };


  res.redirect('/cadastrar_end_cobranca'); 
}

module.exports = {
  cadastrarUsuario
};
