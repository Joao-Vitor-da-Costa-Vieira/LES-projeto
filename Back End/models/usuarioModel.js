const db = require('../config/db');

class Usuario {
    static criar(usuario, callback) {
        const query = `
            INSERT INTO usuario (nome, email, cpf, senha, data_nascimento, telefone1, telefone2, genero)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            usuario.nome,
            usuario.email,
            usuario.cpf,
            usuario.senha,
            usuario.data_nascimento,
            usuario.telefone1,
            usuario.telefone2,
            usuario.genero
        ];
        db.query(query, values, callback);
    }

    static recuperarPorId(id, callback) {
        const query = 'SELECT * FROM usuarios WHERE id = ?';
        db.query(query, [id], callback);
    }

    static atualizar(id, usuario, callback) {
        const query = `
            UPDATE usuarios
            SET nome = ?, email = ?, cpf = ?, senha = ?, data_nascimento = ?, telefone1 = ?, telefone2 = ?, genero = ?
            WHERE id = ?
        `;
        const values = [
            usuario.nome,
            usuario.email,
            usuario.cpf,
            usuario.senha,
            usuario.data_nascimento,
            usuario.telefone1,
            usuario.telefone2,
            usuario.genero,
            id
        ];
        db.query(query, values, callback);
    }
}

module.exports = Usuario;