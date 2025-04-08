const db = require('../config/db');

async function cadastrarVenda(dados,end_id,usr_id) {

    const sql = `INSERT INTO transacoes (
        tra_id,
        tra_numero_venda,
        tra_data,
        tra_valor_frete,
        tra_forma_de_pagamento,
        tra_status,
        tra_valor,
        tra_desconto,
        tra_subtotal,
        enderecos_entrega_end_id,
        usuarios_usr_id           
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const valores = [
        dados.tra_id,
        dados.tra_numero_venda,
        dados.tra_data,
        dados.tra_valor_frete,
        dados.tra_forma_de_pagamento,
        dados.tra_status,
        dados.tra_valor,
        dados.tra_desconto,
        dados.tra_subtotal,
        end_id,
        usr_id 
    ];

    try {
        const [result] = await db.query(sql, valores);
        return result.insertId;
    } catch (err) {
        console.error(`Erro no cadastrarUsuario - modelUsuarios: ${err}`);
        throw err;
    }
}

module.exports = {
    cadastrarVenda
};