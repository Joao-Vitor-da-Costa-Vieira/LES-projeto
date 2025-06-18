const db = require('../../config/db');

async function buscarNotificacoes(usr_id) {
    try {
        const [notificacoes] = await db.query('SELECT * FROM notificacao WHERE usuarios_usr_id = ?',  [usr_id]);
        return notificacoes;
    } catch (err) {
        console.error("Erro no buscarNotificacoes - modelNotificacao: ${err}");
        throw err;
    }
}

async function apagarNotificacao(ntf_id) {
    try {
        
        const [result] = await db.query(
            'DELETE FROM notificacao WHERE ntf_id = ?',
            [ntf_id]
        );
        
        return result;
    } catch (err) {
        console.error(`Erro no apagarNotificacao - modelNotificacao: ${err}`);
        throw err;
    }
}

async function adicionarNotificacao(usr_id, ntf_mensagem, tra_id) {
    try {
        await db.query(
            "INSERT INTO notificacao ( usuarios_usr_id, ntf_mensagem, transacoes_tra_id) VALUES (?, ?, ?)",
            [usr_id, ntf_mensagem, tra_id]
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