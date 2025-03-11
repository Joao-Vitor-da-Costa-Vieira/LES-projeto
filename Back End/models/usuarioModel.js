const db = require('../config/db');

class Usuario {
    static criar(usuario, callback) {
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
        const values = [
            usuario.usr_nome,
            usuario.usr_email,
            usuario.usr_cpf,
            usuario.usr_senha,
            usuario.usr_data_de_nascimento,
            usuario.usr_telefone_1,
            usuario.usr_telefone_2,
            usuario.usr_genero
        ];

        console.log('Query:', query); 
        console.log('Values:', values);

        db.query(query, values, callback);
    }


    static recuperarPorId(usr_id, callback) {
        const query = 'SELECT * FROM usuario WHERE usr_id = ?';
        db.query(query, [usr_id], callback);
    }

    static consultar(coluna, valor, callback) {
        const query = `SELECT * FROM usuario WHERE ${coluna} = ?`;
        db.query(query, [valor], callback);
    }
    
    static recuperarUltimoUsuario(callback) {
        const query = `
            SELECT 
                usr_id, 
                usr_nome, 
                usr_email, 
                usr_cpf,
                usr_senha, 
                usr_data_de_nascimento, 
                usr_telefone_1, 
                usr_telefone_2, 
                usr_genero
            FROM usuario
            ORDER BY usr_id DESC
            LIMIT 1
        `;
        db.query(query, callback);
    }

    static recuperarUltimoId(callback) {
        const query = 'SELECT MAX(usr_id) AS ultimo_id FROM usuario';
        db.query(query, callback);
    }

    static atualizar(usr_id, usuario, callback) {
        const query = `
            UPDATE usuario
            SET 
                usr_nome = ?, 
                usr_email = ?, 
                usr_cpf = ?, 
                usr_senha = ?, 
                usr_data_de_nascimento = ?, 
                usr_telefone_1 = ?, 
                usr_telefone_2 = ?, 
                usr_genero = ?
            WHERE usr_id = ?
        `;
        const values = [
            usuario.usr_nome,
            usuario.usr_email,
            usuario.usr_cpf,
            usuario.usr_senha,
            usuario.usr_data_de_nascimento,
            usuario.usr_telefone_1,
            usuario.usr_telefone_2,
            usuario.usr_genero,
            usr_id
        ];
        db.query(query, values, callback);
    }

    static desativar(usr_id, callback) {
        const query = 'UPDATE usuario SET usr_status_de_atividade = 0 WHERE usr_id = ?';
        db.query(query, [usr_id], callback);
    }

    static ativar(usr_id, callback) {
        const query = 'UPDATE usuario SET usr_status_de_atividade = 1 WHERE usr_id = ?';
        db.query(query, [usr_id], callback);
    }

    static verificarEnderecos(usuarioId, callback) {
        const query = `
            SELECT 
                (SELECT COUNT(*) FROM endereco_cobranca WHERE usuario_usr_id = ?) AS endereco_cobranca,
                (SELECT COUNT(*) FROM endereco_entrega WHERE usuario_usr_id = ?) AS endereco_entrega
        `;
        db.query(query, [usuarioId, usuarioId], callback);
    }
    
    static atualizarStatus(usuarioId, novoStatus, callback) {
        const query = 'UPDATE usuario SET usr_status_de_atividade = ? WHERE usr_id = ?';
        db.query(query, [novoStatus, usuarioId], callback);
    }
    
}

module.exports = Usuario;