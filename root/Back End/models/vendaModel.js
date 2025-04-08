const db = require('../config/db');

async function criarTransacao(transacaoData) {
    const { 
        numeroVenda, 
        data, 
        frete, 
        formaPagamento, 
        status, 
        valor, 
        subtotal, 
        enderecoId, 
        usuarioId 
    } = transacaoData;

    const [result] = await db.query(
        `INSERT INTO transacoes (
            tra_numero_venda,
            tra_data,
            tra_valor_frete,
            tra_forma_de_pagamento,
            tra_status,
            tra_valor,
            tra_subtotal,
            enderecos_entrega_end_id,
            usuarios_usr_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [numeroVenda, data, frete, formaPagamento, status, valor, subtotal, enderecoId, usuarioId]
    );

    return result.insertId;
}

async function criarItemVenda(itemVendaData) {
    const { quantidade, transacaoId, livroId } = itemVendaData;
    
    await db.query(
        `INSERT INTO itens_de_venda (
            itv_qtd_item,
            transacoes_tra_id,
            livros_lvr_id
        ) VALUES (?, ?, ?)`,
        [quantidade, transacaoId, livroId]
    );
}

module.exports = {
    criarItemVenda,
    criarTransacao
};