const db = require('../../config/db');

async function buscarItensCupom(usr_id) {
    try {
        const [itens] = await db.query('SELECT * FROM cupom WHERE usuarios_usr_id = ? AND cup_status = 1',  [usr_id]);
        return itens;
    } catch (err) {
        console.error("Erro no buscarItensCupom - modelCupom: ${err}");
        throw err;
    }
}

async function deletarItensCupom(cup_id) {
    try {
        
        const [result] = await db.query(
            'UPDATE cupom SET cup_status = 0 WHERE cup_id = ?',
            [cup_id]
        );
        
        return result;
    } catch (err) {
        console.error(`Erro no deletarItensCupom - modelCupom: ${err}`);
        throw err;
    }
}

async function adicionarItemCupom(usr_id, cup_valor, cup_nome, cup_data) {
    try {
        await db.query(
            "INSERT INTO cupom (cup_valor, usuarios_usr_id, cup_nome, cup_data) VALUES (?, ?, ?, ?)",
            [cup_valor, usr_id, cup_nome, cup_data]
        );        

        return { success: true, message: 'Item adicionado ao cupom com sucesso' };
    } catch (err) {
        console.error(`Erro no adicionarItemCupom - modelCupom: ${err}`);
        throw err;
    }
}

module.exports = {
    buscarItensCupom,
    deletarItensCupom,
    adicionarItemCupom
};