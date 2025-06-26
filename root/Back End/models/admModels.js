const db = require('../../config/db');

async function buscarTodosAdms() {
    try {
        const [adms] = await db.query('SELECT * FROM administradores');
        return adms;
    } catch (err) {
        console.error(`Erro no buscarTodosUsuarios - modelUsuarios: ${err}`);
        throw err;
    }
}


module.exports = {
    buscarTodosAdms
};