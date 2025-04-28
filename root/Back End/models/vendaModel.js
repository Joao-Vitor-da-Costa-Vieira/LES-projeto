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

async function buscarTransacao(usr_id) {
    try{
        const [result] = await db.query(
            `SELECT 
                t.tra_id,
                DATE_FORMAT(t.tra_data, '%d/%m/%Y') AS tra_data_formatada,
                t.tra_valor,
                t.tra_subtotal,
                t.tra_status,
                t.tra_valor_frete,
                e.end_endereco,
                e.end_numero,
                e.end_complemento,
                e.end_bairro,
                e.end_cidade,
                e.end_estado,
                e.end_cep
            FROM transacoes t
            INNER JOIN enderecos_entrega e ON t.enderecos_entrega_end_id = e.end_id
            WHERE t.usuarios_usr_id = ?
            ORDER BY t.tra_data DESC`,
            [usr_id]
        );

        return result || [];
    } catch(error) {
        console.error('Erro na busca de transações:', error);
        return [];
    }
}

async function buscarFormasPagamento(tra_id) {
    const [formas] = await db.query(
        `SELECT 
            fp.fpg_tipo,
            fp.fpg_valor,
            c.crt_bandeira,
            c.crt_numero,
            c.crt_nome,
            cup.cup_nome,
            cup.cup_valor
        FROM forma_de_pagamento fp
        LEFT JOIN cartoes c ON fp.cartoes_crt_id = c.crt_id
        LEFT JOIN cupom cup ON fp.cupom_cup_id = cup.cup_id
        WHERE fp.transacoes_tra_id = ?`,
        [tra_id]
    );

    return formas.map(forma => ({
        fpg_tipo: forma.fpg_tipo,
        fpg_valor: forma.fpg_valor,
        cartao: forma.crt_numero ? {
            bandeira: forma.crt_bandeira,
            numero: `**** **** **** ${forma.crt_numero.toString().slice(-4)}`,
            nome: forma.crt_nome
        } : null,
        cupom: forma.cup_nome ? {
            nome: forma.cup_nome,
            valor: forma.cup_valor
        } : null
    }));
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
        tra_data DESC
        LIMIT 20;`
    );

    return result;
}

module.exports = {
    processarPagamentoCompleto,
    buscarTransacaoId,
    buscarTransacao,
    buscarTransacoesPrioridade,
    buscarFormasPagamento
};