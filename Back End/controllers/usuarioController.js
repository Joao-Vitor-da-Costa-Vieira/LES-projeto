const Usuario = require('../models/usuarioModel');

exports.cadastrarUsuario = async (req, res) => {
  const { nome, email, cpf, senha, data_nascimento, telefone1, telefone2, genero } = req.body;

  try {
    await Usuario.cadastrar(nome, email, cpf, senha, data_nascimento, telefone1, telefone2, genero);
    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    res.status(500).json({ error: 'Erro ao cadastrar usuário' });
  }
};