const pool = require('../config/db');

async function cadastrar(usr_id, cidade, bairro, estado, endereco, numero, complemento, cep) {
  try {
    await pool.query(
      'INSERT INTO endereco_entrega (end_e_usr_id, end_e_cidade, end_e_bairro, end_e_estado, end_e_endereco, end_e_numero, end_e_complemento, end_e_cep) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [usr_id, cidade, bairro, estado, endereco, numero, complemento, cep]
    );
  } catch (error) {
    console.error('Erro ao cadastrar endereço de entrega:', error);
    throw error;
  }
}

module.exports = {
  cadastrar,
};