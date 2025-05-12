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
            [data, frete, 'APROVADO', total, subtotal, enderecoId, usuarioId]
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
                'UPDATE cupom SET cup_status = 0 WHERE cup_id IN (?)',
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
            cup.cup_valor,
            cup.cup_data
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
            valor: forma.cup_valor,
            data: forma.cup_data
        } : null
    }));
}

async function buscarTransacoesPrioridade() {
    return buscarTransacoesFiltradas({
        status: ['APROVADO', 'TROCA SOLICITADA', 'DEVOLUÇÃO SOLICITADA']
    });
}

async function buscarTransacoesFiltradas(filtros = {}) {
    let query = `
        SELECT 
            t.*,
            u.usr_id AS usuarios_usr_id,
            u.usr_nome
        FROM transacoes t
        INNER JOIN usuarios u ON t.usuarios_usr_id = u.usr_id
        WHERE 1=1
    `;

    const params = [];

    // Filtro de status
    if (filtros.status) {
        if (Array.isArray(filtros.status)) {
            query += ` AND t.tra_status IN (${filtros.status.map(() => '?').join(',')})`;
            params.push(...filtros.status);
        } else {
            query += ' AND t.tra_status = ?';
            params.push(filtros.status);
        }
    }

    // Filtro de valor máximo
    if (filtros.valorMaximo) {
        query += ' AND t.tra_valor <= ?';
        params.push(parseFloat(filtros.valorMaximo));
    }

    // Filtro de data
    if (filtros.dataInicio && filtros.dataFim) {
        query += ' AND t.tra_data BETWEEN ? AND ?';
        params.push(filtros.dataInicio, filtros.dataFim + ' 23:59:59');
    }

    // Filtro de nome do usuário
    if (filtros.nomeUsuario) {
        query += ' AND u.usr_nome LIKE ?';
        params.push(`%${filtros.nomeUsuario}%`);
    }

    // Ordenação padrão
    query += `
        ORDER BY 
            CASE 
                WHEN t.tra_status = 'APROVADO' THEN 1
                WHEN t.tra_status = 'TROCA SOLICITADA' THEN 2
                WHEN t.tra_status = 'DEVOLUÇÃO SOLICITADA' THEN 3
                ELSE 4
            END ASC,
            t.tra_data DESC
        LIMIT 20
    `;

    const [result] = await db.query(query, params);
    return result;
}

async function buscarTransacaoPorId(tra_id) {
    const [result] = await db.query(
        `SELECT 
            t.*,
            DATE_FORMAT(t.tra_data, '%d/%m/%Y %H:%i') AS tra_data_formatada
        FROM transacoes t
        WHERE t.tra_id = ?`,
        [tra_id]
    );
    return result[0];
}

async function buscarItensVendaPorTransacao(tra_id) {
    const [itens] = await db.query(
        `SELECT 
            itv.*,
            l.lvr_titulo,
            l.lvr_custo,
            g.grp_margem_lucro
        FROM itens_de_venda itv
        INNER JOIN livros l ON itv.livros_lvr_id = l.lvr_id
        INNER JOIN grupo_de_precificacao g ON l.grupo_de_precificacao_grp_id = g.grp_id
        WHERE itv.transacoes_tra_id = ?`,
        [tra_id]
    );
    return itens;
}

async function atualizarTransacaoStatus(tra_status, tra_id) {
    try {        
        const [result] = await db.query(`UPDATE transacoes SET tra_status = ? WHERE tra_id = ?`, [tra_status, tra_id]);

        return result;
    } catch (err) {
        console.error(`Erro no atualizarTransacaoStatus- modelVendas: ${err}`);
        throw err;
    }
}

async function buscarUsuarioPorTransacao(tra_id) {
    try {        
        const [result] = await db.query(`SELECT usuarios_usr_id from transacoes WHERE tra_id = ?`, [tra_id]);

        return result[0];
    } catch (err) {
        console.error(`Erro no buscarUsuarioPorTransacao- modelVendas: ${err}`);
        throw err;
    }
}

async function atualizarStatusEReporEstoque(tra_id, novoStatus) {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Atualizar status da transação
        const [result] = await connection.query(
            'UPDATE transacoes SET tra_status = ? WHERE tra_id = ?',
            [novoStatus, tra_id]
        );

        // 2. Buscar itens da transação
        const [itens] = await connection.query(
            'SELECT livros_lvr_id, itv_qtd_item FROM itens_de_venda WHERE transacoes_tra_id = ?',
            [tra_id]
        );

        // 3. Atualizar estoque dos livros
        for (const item of itens) {
            await connection.query(
                'UPDATE livros SET lvr_qtd_estoque = lvr_qtd_estoque + ? WHERE lvr_id = ?',
                [item.itv_qtd_item, item.livros_lvr_id]
            );
        }

        await connection.commit();
        return result;;

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

async function buscarItensTransacao(tra_id) {
    const [itens] = await db.query(
        'SELECT livros_lvr_id, itv_qtd_item FROM itens_de_venda WHERE transacoes_tra_id = ?',
        [tra_id]
    );
    return itens;
}

async function criarTroca(usuarioId, dadosTroca, itensOriginais) {
    const connection = await db.getConnection();
    console.log(usuarioId);
    console.log(dadosTroca);
    console.log(itensOriginais);
    try {
        await connection.beginTransaction();

        for (const item of dadosTroca.itens) {
            const lvrId = Number(item.lvr_id);
            
            const itemOriginal = itensOriginais.find(i => 
                Number(i.livros_lvr_id) === lvrId
            );

            if (!itemOriginal) {
                throw new Error(`Livro ID ${lvrId} não encontrado na transação original`);
            }

            if (item.quantidade < 0 || item.quantidade > itemOriginal.itv_qtd_item) {
                throw new Error(
                    `Quantidade inválida para "${itemOriginal.lvr_titulo}"\n` +
                    `Máximo permitido: ${itemOriginal.itv_qtd_item}`
                );
            }
        }

        const [novaTransacao] = await connection.query(
            `INSERT INTO transacoes SET
                tra_data = NOW(),
                tra_status = 'TROCA SOLICITADA',
                tra_subtotal = ?,
                tra_valor = ?,
                tra_valor_frete = 0,
                enderecos_entrega_end_id = ?,
                usuarios_usr_id = ?,
                tra_id_original = ?`,
            [
                dadosDevolucao.subtotal,
                dadosDevolucao.subtotal,
                dadosDevolucao.end_id,
                usuarioId,
                dadosTroca.tra_id_original
            ]
        );

        // Inserir itens da troca
        for (const item of dadosTroca.itens) {
            await connection.query(
                `INSERT INTO itens_de_venda SET
                    itv_qtd_item = ?,
                    transacoes_tra_id = ?,
                    livros_lvr_id = ?`,
                [
                    item.quantidade,
                    novaTransacao.insertId,
                    item.lvr_id
                ]
            );
        }

        await connection.commit();
        return novaTransacao.insertId;

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

async function criarDevolucao(usuarioId, dadosDevolucao, itensOriginais) {
    const connection = await db.getConnection();
    console.log(usuarioId);
    console.log(dadosDevolucao);
    console.log(itensOriginais);
    try {
        await connection.beginTransaction();

        for (const item of dadosDevolucao.itens) {
            const lvrId = Number(item.lvr_id);
            
            const itemOriginal = itensOriginais.find(i => 
                Number(i.livros_lvr_id) === lvrId
            );

            if (!itemOriginal) {
                throw new Error(`Livro ID ${lvrId} não encontrado na transação original`);
            }

            if (item.quantidade < 0 || item.quantidade > itemOriginal.itv_qtd_item) {
                throw new Error(
                    `Quantidade inválida para "${itemOriginal.lvr_titulo}"\n` +
                    `Máximo permitido: ${itemOriginal.itv_qtd_item}`
                );
            }
        }

        const [novaTransacao] = await connection.query(
            `INSERT INTO transacoes SET
                tra_data = NOW(),
                tra_status = 'DEVOLUCAO SOLICITADA',
                tra_subtotal = ?,
                tra_valor = ?,
                tra_valor_frete = 0,
                enderecos_entrega_end_id = ?,
                usuarios_usr_id = ?,
                tra_id_original = ?`,
            [
                dadosDevolucao.subtotal,
                dadosDevolucao.subtotal,
                dadosDevolucao.end_id,
                usuarioId,
                dadosDevolucao.tra_id_original
            ]
        );

        // Inserir itens da troca
        for (const item of dadosDevolucao.itens) {
            await connection.query(
                `INSERT INTO itens_de_venda SET
                    itv_qtd_item = ?,
                    transacoes_tra_id = ?,
                    livros_lvr_id = ?`,
                [
                    item.quantidade,
                    novaTransacao.insertId,
                    item.lvr_id
                ]
            );
        }

        await connection.commit();
        return novaTransacao.insertId;

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

async function verificarTransacaoAssociada(tra_id) {
    
    const [trocas] = await db.query(`SELECT * from transacoes WHERE tra_id_original = ? AND tra_status = 'TROCA CONCLUIDA'`, [tra_id]);
    const [devolucoes] = await db.query(`SELECT * from transacoes WHERE tra_id_original = ? AND tra_status = 'DEVOLUCAO CONCLUIDA'`, [tra_id]);

    if(!devolucoes){
        } else {
            return 1;
    }

    if(!trocas){
        return;
    } else{
        return 2;
    }
}

async function cancelarTransacaoAssociada(tra_id) {
    
    await db.query(`DELETE * from transacoes WHERE tra_id_original = ? AND tra_status = 'TROCA SOLICITADA'`, [tra_id]);
    await db.query(`DELETE * from transacoes WHERE tra_id_original = ? AND tra_status = 'DEVOLUCAO SOLICITADA'`, [tra_id]);
    await db.query(`DELETE * from transacoes WHERE tra_id_original = ? AND tra_status = 'TROCA APROVADA'`, [tra_id]);
    await db.query(`DELETE * from transacoes WHERE tra_id_original = ? AND tra_status = 'DEVOLUCAO APROVADA'`, [tra_id]);

}

module.exports = {
    processarPagamentoCompleto,
    buscarTransacaoId,
    buscarTransacao,
    buscarTransacoesPrioridade,
    buscarFormasPagamento,
    buscarTransacoesFiltradas,
    buscarItensVendaPorTransacao,
    buscarTransacaoPorId,
    atualizarTransacaoStatus,
    buscarUsuarioPorTransacao,
    buscarItensTransacao,
    atualizarStatusEReporEstoque,
    criarTroca,
    criarDevolucao,
    verificarTransacaoAssociada,
    cancelarTransacaoAssociada
};