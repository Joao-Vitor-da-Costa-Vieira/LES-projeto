const db = require('../config/db');

async function buscarNotificacoes(usr_id) {
    try {
        const [notificacoes] = await db.query('SELECT * FROM notificacao WHERE usuarios_usr_id = ?',  [usr_id]);
        return notificacoes;
    } catch (err) {
        console.error("Erro no buscarNotificacoes - modelNotificacao: ${err}");
        throw err;
    }
}

async function apagarNotificacao(not_id) {
    try {
        
        const [result] = await db.query(
            'DELETE FROM notificacao WHERE not_id = ?',
            [not_id]
        );
        
        return result;
    } catch (err) {
        console.error(`Erro no apagarNotificacao - modelNotificacao: ${err}`);
        throw err;
    }
}

async function adicionarNotificacao(usr_id, not_mensagem) {
    try {
        await db.query(
            "INSERT INTO notificacao ( usuarios_usr_id, not_mensagem) VALUES (?, ?)",
            [usr_id, not_mensagem]
        );        

        return { success: true, message: 'Item adicionado às notficações com sucesso' };
    } catch (err) {
        console.error(`Erro no adicionarNotificacao - modelNotificacao: ${err}`);
        throw err;
    }
}

module.exports = {
    buscarNotificacoes,
    apagarNotificacao,
    adicionarNotificacao
};