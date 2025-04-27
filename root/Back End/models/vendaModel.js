const db = require('../config/db');

async function processarPagamentoCompleto({
    usuarioId,
    enderecoId,
    data,
    subtotal,
    frete,
    total,
    pagamentos,
    itensCarrinho
}) {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Criar transação principal
        const [transacaoResult] = await connection.query(
            `INSERT INTO transacoes (
                tra_data,
                tra_valor_frete,
                tra_status,
                tra_valor,
                tra_subtotal,
                enderecos_entrega_end_id,
                usuarios_usr_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [data, frete, 'EM PROCESSAMENTO', total, subtotal, enderecoId, usuarioId]
        );
        const tra_id = transacaoResult.insertId;

        // Registrar formas de pagamento
        for (const pagamento of pagamentos) {
            let tipo;
            switch(pagamento.tipo) {
                case '1': tipo = 'Cartão de Crédito'; break;
                case '2': tipo = 'Cupom de Troca'; break;
                case '3': tipo = 'Cupom de Promoção'; break;
                default: throw new Error('Tipo de pagamento inválido');
            }

            await connection.query(
                `INSERT INTO forma_de_pagamento (
                    fpg_tipo,
                    fpg_valor,
                    transacoes_tra_id,
                    cartoes_crt_id,
                    cupom_cup_id
                ) VALUES (?, ?, ?, ?, ?)`,
                [tipo, pagamento.valor, tra_id, pagamento.cartaoId || null, pagamento.cupomId || null]
            );
        }

        // Registrar itens e atualizar estoque
        for (const item of itensCarrinho) {
            await connection.query(
                `INSERT INTO itens_de_venda (
                    itv_qtd_item,
                    transacoes_tra_id,
                    livros_lvr_id
                ) VALUES (?, ?, ?)`,
                [item.car_qtd_item, tra_id, item.livros_lvr_id]
            );

            await connection.query(
                'UPDATE livros SET lvr_qtd_estoque = lvr_qtd_estoque - ? WHERE lvr_id = ?',
                [item.car_qtd_item, item.livros_lvr_id]
            );
        }

        // Limpar carrinho
        await connection.query(
            'DELETE FROM carrinho WHERE usuarios_usr_id = ?',
            [usuarioId]
        );

        // Remover cupons utilizados
        const cuponsIds = pagamentos
            .filter(p => p.cupomId)
            .map(p => p.cupomId);

        if (cuponsIds.length > 0) {
            await connection.query(
                'DELETE FROM cupom WHERE cup_id IN (?)',
                [cuponsIds]
            );
        }

        await connection.commit();
        return tra_id;

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
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
    processarPagamentoCompleto,
    buscarTransacaoId,
    buscarTransacao,
    buscarTransacoesPrioridade,
    formaPagamentoId
};