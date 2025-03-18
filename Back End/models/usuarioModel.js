const db = require('../config/db');

// Função que insere um novo usuário no banco
async function cadastrarUsuario(dados) {
    // Consulta SQL
    const sql = `INSERT INTO usuarios (
        usr_nome, 
        usr_email, 
        usr_cpf, 
        usr_data_de_nascimento, 
        usr_telefone1,
        usr_telefone2,  
        usr_genero, 
        usr_senha, 
        usr_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`;

    // Valores a serem inseridos no banco (na nova ordem)
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

// Atualizando os dados dos usuários no banco
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

// Alterar senha de um usuário
async function alterarSenhaUsuario(senha, id) {
    try {
        await db.query(`UPDATE usuarios SET usr_senha = ? WHERE usr_id = ?`, [senha.usr_senha, id]);
    } catch (err) {
        console.error(`Erro no alterarSenhaUsuario - modelUsuarios: ${err}`);
        throw err;
    }
}

// Inativando um usuário específico
async function inativarUsuario(id) {
    try {
        await db.query(`UPDATE usuarios SET usr_status_de_atividade = 0 WHERE usr_id = ?`, id);
    } catch (err) {
        console.error(`Erro no inativarUsuario - modelUsuarios: ${err}`);
        throw err;
    }
}

// Ativando um usuário específico
async function ativarUsuario(id) {
    try {
        await db.query(`UPDATE usuarios SET usr_status_de_atividade = 1 WHERE usr_id = ?`, id);
    } catch (err) {
        console.error(`Erro no ativarUsuario - modelUsuarios: ${err}`);
        throw err;
    }
}

// Buscando usuários ativos
async function buscarUsuariosAtivos() {
    try {
        const [usuarios] = await db.query('SELECT * FROM usuarios WHERE usr_status_de_atividade = 1');
        return usuarios;
    } catch (err) {
        console.error(`Erro no buscarUsuariosAtivos - modelUsuarios: ${err}`);
        throw err;
    }
}

// Buscando usuários inativos
async function buscarUsuariosInativos() {
    try {
        const [usuarios] = await db.query('SELECT * FROM usuarios WHERE usr_status_de_atividade = 0');
        return usuarios;
    } catch (err) {
        console.error(`Erro no buscarUsuariosInativos - modelUsuarios: ${err}`);
        throw err;
    }
}

// Buscando todos os usuários do banco de dados
async function buscarTodosUsuarios() {
    try {
        const [usuarios] = await db.query('SELECT * FROM usuarios');
        return usuarios;
    } catch (err) {
        console.error(`Erro no buscarTodosUsuarios - modelUsuarios: ${err}`);
        throw err;
    }
}

// Buscando usuários por id
async function buscarUsuarioId(id) {
    try {
        const [usuario] = await db.query(`SELECT * FROM usuarios WHERE usr_id = ?`, id);
        return usuario;
    } catch (err) {
        console.error(`Erro no buscarUsuarioId - modelUsuarios: ${err}`);
        throw err;
    }
}

// Exportando as funções de busca
module.exports = {
    buscarTodosUsuarios,
    buscarUsuarioId,
    buscarUsuariosInativos,
    buscarUsuariosAtivos,
    inativarUsuario,
    ativarUsuario,
    cadastrarUsuario,
    atualizarUsuario,
    alterarSenhaUsuario
};