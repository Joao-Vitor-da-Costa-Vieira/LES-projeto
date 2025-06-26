const db = require('../config/db');

async function buscarTodosAdms() {
    try {
        const [adms] = await db.query('SELECT * FROM administradores WHERE adm_status_de_atividade = 1');
        return adms;
    } catch (err) {
        console.error(`Erro no buscarTodosAdms - modelAdm: ${err}`);
        throw err;
    }
}

async function buscarAdmId(id) {
    try {
        const [adm] = await db.query(`SELECT * FROM administradores WHERE adm_id = ?`, [id]);
        return adm;
    } catch (err) {
        console.error(`Erro no buscarAdmId - modelAdm: ${err}`);
        throw err;
    }
}

module.exports = {
    buscarTodosAdms,
    buscarAdmId
};