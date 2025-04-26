const db = require('../config/db');

async function criarTransacao(numeroVenda, data, frete, status, valor, subtotal, enderecoId, usuarioId) {
    const [result] = await db.query(
        `INSERT INTO transacoes (
            tra_numero_venda,
            tra_data,
            tra_valor_frete,
            tra_status,
            tra_valor,
            tra_subtotal,
            enderecos_entrega_end_id,
            usuarios_usr_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [numeroVenda, data, frete, status, valor, subtotal, enderecoId, usuarioId]
    );
    return result.insertId;
}

async function criarFormaPagamento(tipo, valor, tra_id, cartaoId, cupomId) {
    await db.query(
        `INSERT INTO forma_de_pagamento (
            fpg_tipo,
            fpg_valor,
            transacoes_tra_id,
            cartoes_crt_id,
            cupom_cup_id
        ) VALUES (?, ?, ?, ?, ?)`,
        [tipo, valor, tra_id, cartaoId || null, cupomId || null]
    );
}

async function criarItemVenda(quantidade, transacaoId, livroId) {
    
    await db.query(
        `INSERT INTO itens_de_venda (
            itv_qtd_item,
            transacoes_tra_id,
            livros_lvr_id
        ) VALUES (?, ?, ?)`,
        [quantidade, transacaoId, livroId]
    );
}

async function buscarTransacaoId(usuarioId) {
    const [result] = await db.query(`SELECT tra_id FROM transacoes WHERE usuarios_usr_id = ?`,[usuarioId]);

        return result;
}

async function buscarTransacao(usr_id){
    const [result] = await db.query(
        `SELECT 
            tra_id,
            tra_numero_venda,
            DATE_FORMAT(tra_data, '%d/%m/%Y') as tra_data_formatada,
            tra_valor,
            tra_subtotal,
            tra_forma_de_pagamento,
            tra_status
        FROM transacoes 
        WHERE usuarios_usr_id = ?
        ORDER BY tra_data DESC`,
        [usr_id]
    );

    return result;
}

async function buscarTransacoesPrioridade(){
    const [result] = await db.query(
        `SELECT *
        FROM transacoes
        WHERE tra_status IN ('APROVADO', 'TROCA SOLICITADA', 'DEVOLUÇÃO SOLICITADA')
        ORDER BY 
        CASE 
            WHEN tra_status = 'APROVADO' THEN 1
            WHEN tra_status = 'TROCA SOLICITADA' THEN 2
            WHEN tra_status = 'DEVOLUÇÃO SOLICITADA' THEN 3
        END ASC,
        tra_data DESC;`
    );

    return result;
}

async function formaPagamentoId(tra_id) {
    const [result] = await db.query(
        `SELECT fpg_tipo
        FROM forma_de_pagamento
        WHERE transacoes_tra_id = ?`,
        [tra_id]
    );
    
    return result;
}

module.exports = {
    criarTransacao,
    criarFormaPagamento,
    criarItemVenda,
    buscarTransacaoId,
    buscarTransacao,
    buscarTransacoesPrioridade,
    formaPagamentoId
};