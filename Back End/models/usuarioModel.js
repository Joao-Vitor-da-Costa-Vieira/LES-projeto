const pool = require('../config/db');

async function cadastrar(nome, email, cpf, senha, data_nascimento, telefone1, telefone2, genero) {
  try {
    const [result] = await pool.query(
      'INSERT INTO usuario (usr_nome, usr_email, usr_cpf, usr_senha, usr_data_de_nascimento, usr_telefone_1, usr_telefone_2, usr_genero) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [nome, email, cpf, senha, data_nascimento, telefone1, telefone2, genero]
    );
    return { usr_id: result.insertId, nome, email, cpf, senha, data_nascimento, telefone1, telefone2, genero };
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    throw error;
  }
}

module.exports = {
  cadastrar,
};