const db = require('../config/db');

async function buscarItensCupom(usr_id) {
    try {
        const [itens] = await db.query('SELECT * FROM cupom WHERE usuarios_usr_id = ?',  [usr_id]);
        return itens;
    } catch (err) {
        console.error("Erro no buscarItensCupom - modelCupom: ${err}");
        throw err;
    }
}

async function deletarItensCupom(cup_id) {
    try {
        const [result] = await db.query(
            "SELECT usuarios_usr_id FROM cupom WHERE cup_id = ?", 
            [cup_id]
        );
        
        if (result.length === 0) {
            throw new Error('Item do cupom não encontrado');
        }
        
        const usr_id = result[0].usuarios_usr_id;
        
        await db.query(
            'DELETE FROM cupom WHERE car_id = ?',
            [car_id]
        );
        
        return usr_id;
    } catch (err) {
        console.error(`Erro no deletarItensCupom - modelCupom: ${err}`);
        throw err;
    }
}

async function adicionarItemCupom(usr_id, cup_valor, cup_nome) {
    try {
        await db.query(
            "INSERT INTO cupom (cup_valor, usuarios_usr_id, cup_nome) VALUES (?, ?, ?)",
            [cup_valor, usr_id, cup_nome]
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