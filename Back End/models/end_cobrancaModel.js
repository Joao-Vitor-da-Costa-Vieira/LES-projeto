const db = require('../config/db');
const Usuario = require('../models/usuarioModel');

class EnderecoCobranca {
    static criar(enderecoCobranca, callback) {
        const query = `
            INSERT INTO endereco_cobranca (
                end_estado, 
                end_cidade, 
                end_bairro,
                end_endereco,  
                end_numero, 
                end_complemento, 
                end_cep, 
                usuario_usr_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            enderecoCobranca.end_estado,
            enderecoCobranca.end_cidade,
            enderecoCobranca.end_bairro,
            enderecoCobranca.end_endereco,
            enderecoCobranca.end_numero,
            enderecoCobranca.end_complemento,
            enderecoCobranca.end_cep,
            enderecoCobranca.usuario_usr_id
        ];

        db.query(query, values, callback);
    }

    static recuperarPorId(id, callback) {
        const query = 'SELECT * FROM endereco_cobranca WHERE end_id = ?';
        db.query(query, [id], callback);
    }

    static recuperarPorUsuarioId(usuarioId, callback) {
      const query = `
          SELECT 
              end_id, 
              end_estado, 
              end_cidade, 
              end_bairro, 
              end_numero, 
              end_complemento, 
              end_cep, 
              end_endereco
          FROM endereco_cobranca
          WHERE usuario_usr_id = ?
      `;
      db.query(query, [usuarioId], callback);
  }

    static atualizar(id, enderecoCobranca, callback) {
        const query = `
            UPDATE endereco_cobranca
            SET 
                end_estado = ?, 
                end_cidade = ?, 
                end_bairro = ?, 
                end_numero = ?, 
                end_complemento = ?, 
                end_cep = ?, 
                end_endereco = ?, 
                usuario_usr_id = ?
            WHERE end_id = ?
        `;
        const values = [
            enderecoCobranca.end_estado,
            enderecoCobranca.end_cidade,
            enderecoCobranca.end_bairro,
            enderecoCobranca.end_numero,
            enderecoCobranca.end_complemento,
            enderecoCobranca.end_cep,
            enderecoCobranca.end_endereco,
            enderecoCobranca.usuario_usr_id,
            id
        ];

        db.query(query, values, callback);
    }
}

module.exports = EnderecoCobranca;