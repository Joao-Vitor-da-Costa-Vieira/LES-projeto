const db = require('../config/db');

class EnderecoEntrega {
    static criar(enderecoEntrega, callback) {
        const query = `
            INSERT INTO endereco_entrega (
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
            enderecoEntrega.end_estado,
            enderecoEntrega.end_cidade,
            enderecoEntrega.end_bairro,
            enderecoEntrega.end_endereco,
            enderecoEntrega.end_numero,
            enderecoEntrega.end_complemento,
            enderecoEntrega.end_cep,
            enderecoEntrega.usuario_usr_id
        ];

        db.query(query, values, callback);
    }

    static recuperarPorId(id, callback) {
        const query = 'SELECT * FROM endereco_entrega WHERE end_id = ?';
        db.query(query, [id], callback);
    }

    static atualizar(id, enderecoEntrega, callback) {
        const query = `
            UPDATE endereco_entrega
            SET 
                end_estado = ?, 
                end_cidade = ?, 
                end_bairro = ?,
                end_endereco = ?, 
                end_numero = ?, 
                end_complemento = ?, 
                end_cep = ?,  
                usuario_usr_id = ?
            WHERE end_id = ?
        `;
        const values = [
            enderecoEntrega.end_estado,
            enderecoEntrega.end_cidade,
            enderecoEntrega.end_bairro,
            enderecoEntrega.end_endereco,
            enderecoEntrega.end_numero,
            enderecoEntrega.end_complemento,
            enderecoEntrega.end_cep,
            enderecoEntrega.usuario_usr_id,
            id
        ];

        db.query(query, values, callback);
    }
}

module.exports = EnderecoEntrega;