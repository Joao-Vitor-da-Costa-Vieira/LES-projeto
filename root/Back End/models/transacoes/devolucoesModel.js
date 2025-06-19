const db = require('../../config/db');

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

        // Inserir itens da devolução
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

    if (devolucoes.length > 0) {
        return 1;
    }

    if (trocas.length > 0) {
        return 2;
    }

    return 0;
}

async function cancelarTransacaoAssociada(tra_id_original) {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Buscar IDs das transações filhas
        const [transacoes] = await connection.query(`
            SELECT tra_id 
            FROM transacoes 
            WHERE tra_id_original = ? 
            AND tra_status IN (
                'TROCA SOLICITADA', 
                'DEVOLUCAO SOLICITADA', 
                'TROCA APROVADA', 
                'DEVOLUCAO APROVADA'
            )
        `, [tra_id_original]);

        const idsTransacoes = transacoes.map(t => t.tra_id);

        if (idsTransacoes.length > 0) {
            // 2. Excluir itens_de_venda relacionados
            await connection.query(`
                DELETE FROM itens_de_venda 
                WHERE transacoes_tra_id IN (?)
            `, [idsTransacoes]);

            // 3. Excluir transações
            await connection.query(`
                DELETE FROM transacoes 
                WHERE tra_id IN (?)
            `, [idsTransacoes]);
        }

        await connection.commit();
        
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

module.exports = {
    criarDevolucao,
    verificarTransacaoAssociada,
    cancelarTransacaoAssociada
};