const db = require('../config/db');

async function entradaEstoque(entrada) {
     const sql = `INSERT INTO estoque (
        est_quantidade,
        est_custo,
        est_fornecedor,
        est_data ,
        livros_lvr_id
    ) VALUES (?, ?, ?, ?, ?)`;

    const valores = [
        entrada.est_quantidade,
        entrada.est_custo,
        entrada.est_fornecedor,
        entrada.est_data,
        entrada.livros_lvr_id
    ];

    try {
        await db.query(sql, valores);
    } catch (err) {
        console.error(`Erro no entradaEstoque - modelEstoque: ${err}`);
        throw err;
    }
}

module.exports = {
    entradaEstoque
};