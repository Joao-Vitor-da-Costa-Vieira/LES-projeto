const pool = require('../config/db');

async function cadastrar(usr_id, cidade, bairro, estado, endereco, numero, complemento, cep) {
  try {
    await pool.query(
      'INSERT INTO endereco_cobranca (end_c_usr_id, end_c_cidade, end_c_bairro, end_c_estado, end_c_endereco, end_c_numero, end_c_complemento, end_c_cep) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [usr_id, cidade, bairro, estado, endereco, numero, complemento, cep]
    );
  } catch (error) {
    console.error('Erro ao cadastrar endereço de cobrança:', error);
    throw error;
  }
}

module.exports = {
  cadastrar,
};