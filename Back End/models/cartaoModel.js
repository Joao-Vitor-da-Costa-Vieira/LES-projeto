const db = require('../config/db');
const Usuario = require('../models/usuarioModel');

class Cartao {
    static criar(cartao, callback) {
        const query = `
            INSERT INTO cartao (
                crt_numero,
                crt_codigo_seguranca,
                crt_bandeira,
                crt_nome,
                usuario_usr_id
            ) VALUES (?, ?, ?, ?, ?)
        `;
        const values = [
            cartao.crt_numero,
            cartao.crt_codigo_seguranca,
            cartao.crt_bandeira,
            cartao.crt_nome,
            cartao.usuario_usr_id
        ];

        db.query(query, values, callback);
    }

    static recuperarPorId(id, callback) {
        const query = 'SELECT * FROM cartao WHERE crt_id = ?';
        db.query(query, [id], callback);
    }

    static atualizar(id, cartao, callback) {
        const query = `
            UPDATE cartao
            SET 
                crt_numero = ?,
                crt_codigo_seguranca = ?,
                crt_bandeira = ?,
                crt_nome = ?,
                usuario_usr_id = ?
            WHERE crt_id = ?
        `;
        const values = [
            cartao.crt_numero,
            cartao.crt_codigo_seguranca,
            cartao.crt_bandeira,
            cartao.crt_nome,
            cartao.usuario_usr_id,
            id
        ];

        db.query(query, values, callback);
    }
}

module.exports = Cartao;