const db = require('../../config/db');

async function cadastrarUsuario(dados) {

    const sql = `INSERT INTO usuarios (
        usr_nome, 
        usr_email, 
        usr_cpf, 
        usr_data_de_nascimento, 
        usr_telefone_1,
        usr_telefone_2,  
        usr_genero, 
        usr_senha,
        usr_status_de_atividade 
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`;

    const valores = [
        dados.usr_nome,
        dados.usr_email,
        dados.usr_cpf,
        dados.usr_data_de_nascimento,
        dados.usr_telefone1,
        dados.usr_telefone2,
        dados.usr_genero,
        dados.usr_senha
    ];

    try {
        const [result] = await db.query(sql, valores);
        return result.insertId;
    } catch (err) {
        console.error(`Erro no cadastrarUsuario - modelUsuarios: ${err}`);
        throw err;
    }
}

async function atualizarUsuario(dados, usr_id) {
    const campos = Object.keys(dados).map(key => `${key} = ?`).join(', ');
    let valores = Object.values(dados);
    valores.push(usr_id);

    const sql = `UPDATE usuarios SET ${campos} WHERE usr_id = ?`;

    try {
        const [usuario] = await db.query(sql, valores);
        return usuario;
    } catch (err) {
        console.error(`Erro no atualizarUsuario - modelUsuarios: ${err}`);
        throw err;
    }
}

async function alterarSenhaUsuario(senha, id) {
    try {
        await db.query(`UPDATE usuarios SET usr_senha = ? WHERE usr_id = ?`, [senha.usr_senha, id]);
    } catch (err) {
        console.error(`Erro no alterarSenhaUsuario - modelUsuarios: ${err}`);
        throw err;
    }
}

async function inativarUsuario(id) {
    try {
        await db.query(`UPDATE usuarios SET usr_status_de_atividade = 0 WHERE usr_id = ?`, [id]);
    } catch (err) {
        console.error(`Erro no inativarUsuario - modelUsuarios: ${err}`);
        throw err;
    }
}

async function ativarUsuario(id) {
    try {
        await db.query(`UPDATE usuarios SET usr_status_de_atividade = 1 WHERE usr_id = ?`, [id]);
    } catch (err) {
        console.error(`Erro no ativarUsuario - modelUsuarios: ${err}`);
        throw err;
    }
}

async function buscarUsuariosAtivos() {
    try {
        const [usuarios] = await db.query('SELECT * FROM usuarios WHERE usr_status_de_atividade = 1');
        return usuarios;
    } catch (err) {
        console.error(`Erro no buscarUsuariosAtivos - modelUsuarios: ${err}`);
        throw err;
    }
}

async function buscarUsuariosInativos() {
    try {
        const [usuarios] = await db.query('SELECT * FROM usuarios WHERE usr_status_de_atividade = 0');
        return usuarios;
    } catch (err) {
        console.error(`Erro no buscarUsuariosInativos - modelUsuarios: ${err}`);
        throw err;
    }
}

async function buscarTodosUsuarios() {
    try {
        const [usuarios] = await db.query('SELECT * FROM usuarios');
        return usuarios;
    } catch (err) {
        console.error(`Erro no buscarTodosUsuarios - modelUsuarios: ${err}`);
        throw err;
    }
}

async function buscarUsuarioId(id) {
    try {
        const [usuario] = await db.query(`SELECT * FROM usuarios WHERE usr_id = ?`, [id]);
        return usuario;
    } catch (err) {
        console.error(`Erro no buscarUsuarioId - modelUsuarios: ${err}`);
        throw err;
    }
}

async function consultaFiltroUsuario(filtros){
    try {

        // Query modificada para MySQL
        let queryBase = `
            SELECT 
                *
            FROM usuarios
        `;

        const conditions = [];
        const params = [];

        if (filtros.nome) {
            conditions.push(`usr_nome LIKE ?`);
            params.push(`%${filtros.nome}%`);
        }

        if (filtros.email) {
            conditions.push(`usr_email LIKE ?`);
            params.push(`%${filtros.email}%`);
        }

        if (filtros.cpf) {
            conditions.push(`usr_cpf LIKE ?`);
            params.push(`%${filtros.cpf}%`);
        }

        if (filtros.selecao) {
            conditions.push(`usr_genero LIKE ?`);
            params.push(`%${filtros.selecao}%`);
        }

        if (filtros.dataNascimento) {
            conditions.push(`usr_data_de_nascimento >= ?`);
            params.push(filtros.dataNascimento);
        }

        if (filtros.telefone) {
            const telNumero = filtros.telefone.replace(/\D/g, '');
            conditions.push(`(
                usr_telefone_1 = ? OR 
                usr_telefone_2 = ?
            )`);
            params.push(parseInt(telNumero, 10));
            params.push(parseInt(telNumero, 10));
        }

        // Combinar condições
        if (conditions.length > 0) {
            queryBase += ` WHERE ` + conditions.join(' AND ');
        }

        queryBase += ` GROUP BY usr_id`;
        
        const [usuarios] = await db.query(queryBase, params);
        return usuarios;
    } catch (err) {
        console.error(`Erro no consultaFiltroUsuario - modelUsuarios: ${err}`);
        throw err;
    }
}

module.exports = {
    buscarTodosUsuarios,
    buscarUsuarioId,
    buscarUsuariosInativos,
    buscarUsuariosAtivos,
    inativarUsuario,
    ativarUsuario,
    cadastrarUsuario,
    atualizarUsuario,
    alterarSenhaUsuario,
    consultaFiltroUsuario
};