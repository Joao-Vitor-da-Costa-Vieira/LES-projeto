const db = require('../../config/db');

async function cadastrarCartao(dados) {
    
    const sql = `INSERT INTO cartoes (
        usuarios_usr_id, 
        crt_nome, 
        crt_numero, 
        crt_bandeira, 
        crt_codigo_seguranca 
    ) VALUES (?, ?, ?, ?, ?)`;

    const valores = [
        dados.crt_usr_id,
        dados.crt_nome,
        dados.crt_numero,
        dados.crt_bandeira,
        dados.crt_codigo_seguranca
    ];

    try {
        await db.query(sql, valores);
    } catch (err) {
        console.error(`Erro no cadastrarCartao - modelCartão: ${err}`);
        throw err;
    }
}

async function atualizarCartao(dados, crt_id) {
    const campos = Object.keys(dados).map(key => `${key} = ?`).join(', ');
    let valores = Object.values(dados);
    valores.push(crt_id);

    const sql = `UPDATE cartoes SET ${campos} WHERE crt_id = ?`;

    try {
        const [cartao] = await db.query(sql, valores);
        return cartao;
    } catch (err) {
        console.error(`Erro no atualizarCartao - modelCartão: ${err}`);
        throw err;
    }
}

async function buscarTodosCartoes() {
    try {
        const [cartoes] = await db.query('SELECT * FROM cartoes');
        return cartoes;
    } catch (err) {
        console.error(`Erro no buscarTodosCartoes - modelCartão: ${err}`);
        throw err;
    }
}

async function buscarCartaoId(id) {
    try {
        const [cartao] = await db.query(`SELECT * FROM cartoes WHERE crt_id = ?`, [id]);
        return cartao;
    } catch (err) {
        console.error(`Erro no buscarCartaoId - modelCartão: ${err}`);
        throw err;
    }
}

async function buscarCartoesUsuarioId(id) {
    try {
        const [cartoes] = await db.query(`SELECT * FROM cartoes WHERE usuarios_usr_id = ?`, [id]);
        return cartoes;
    } catch (err) {
        console.error(`Erro no buscarCartoesUsuarioId - modelCartão: ${err}`);
        throw err;
    }
}

module.exports = {
    buscarCartoesUsuarioId,
    buscarTodosCartoes,
    buscarCartaoId,
    cadastrarCartao,
    atualizarCartao
};