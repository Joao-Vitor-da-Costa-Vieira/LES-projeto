const pool = require('../config/db');

class Usuario {
  static async cadastrar(nome, email, cpf, senha, data_nascimento, telefone1, telefone2, genero) {
    const query = `
      INSERT INTO usuario (
        usr_nome, 
        usr_email, 
        usr_cpf, 
        usr_senha, 
        usr_data_de_nascimento, 
        usr_telefone_1, 
        usr_telefone_2, 
        usr_genero
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [nome, email, cpf, senha, data_nascimento, telefone1, telefone2, genero]);
    return result;
  }
}

module.exports = Usuario;