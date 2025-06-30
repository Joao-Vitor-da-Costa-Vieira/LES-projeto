const db = require('../config/db');

// Buscando os livros do banco de dados pelo titulo
async function buscarLivrosTitulo(titulo) {
    try {
        const [livros] = await db.query(
            `SELECT 
                l.*,
                GROUP_CONCAT(DISTINCT a.atr_nome SEPARATOR ', ') AS atr_nome,
                GROUP_CONCAT(DISTINCT e.edi_nome SEPARATOR ', ') AS edi_nome,
                GROUP_CONCAT(DISTINCT c.cat_nome SEPARATOR ', ') AS cat_nome
             FROM livros l
             LEFT JOIN escreveu es ON l.lvr_id = es.livros_lvr_id
             LEFT JOIN autor a ON es.autor_atr_id = a.atr_id
             LEFT JOIN editou ed ON l.lvr_id = ed.livros_lvr_id
             LEFT JOIN editora e ON ed.editora_edi_id = e.edi_id
             LEFT JOIN possui4 p ON l.lvr_id = p.livros_lvr_id
             LEFT JOIN categoria c ON p.categoria_cat_id = c.cat_id
             WHERE l.lvr_titulo LIKE ?
             GROUP BY l.lvr_id`, 
            [`%${titulo}%`]
        );
        return livros;
    } catch (err) {
        console.error('Erro ao buscar livros:', err);
        throw err; 
    }
}

async function consultaFiltroLivro(filtros){
    try {

        // Query modificada para MySQL
        let queryBase = `
            SELECT 
                l.*,
                GROUP_CONCAT(DISTINCT a.atr_nome SEPARATOR ', ') AS atr_nome,
                GROUP_CONCAT(DISTINCT et.edi_nome SEPARATOR ', ') AS edi_nome,
                GROUP_CONCAT(DISTINCT c.cat_nome SEPARATOR ', ') AS cat_nome
            FROM livros l
            LEFT JOIN escreveu e ON l.lvr_id = e.livros_lvr_id
            LEFT JOIN autor a ON e.autor_atr_id = a.atr_id
            LEFT JOIN editou ed ON l.lvr_id = ed.livros_lvr_id
            LEFT JOIN editora et ON ed.editora_edi_id = et.edi_id
            LEFT JOIN possui4 p ON l.lvr_id = p.livros_lvr_id
            LEFT JOIN categoria c ON p.categoria_cat_id = c.cat_id
        `;

        const conditions = [];
        const params = [];

        // [Restante das condições permanece igual...]
        if (filtros.titulo) {
            conditions.push(`l.lvr_titulo LIKE ?`);
            params.push(`%${filtros.titulo}%`);
        }

        if (filtros.precoMax && !isNaN(filtros.precoMax)) {
            conditions.push(`l.lvr_custo <= ?`);
            params.push(parseFloat(filtros.precoMax));
        }

        if (filtros.autor) {
            conditions.push(`a.atr_nome LIKE ?`);
            params.push(`%${filtros.autor}%`);
        }

        if (filtros.editora) {
            conditions.push(`et.edi_nome LIKE ?`);
            params.push(`%${filtros.editora}%`);
        }

        if (filtros.categoria) {
            conditions.push(`c.cat_nome LIKE ?`);
            params.push(`%${filtros.categoria}%`);
        }

        if (filtros.dataInicio) {
            conditions.push(`l.lvr_ano >= ?`);
            params.push(filtros.dataInicio);
        }

        if (filtros.dataFinal) {
            conditions.push(`l.lvr_ano <= ?`);
            params.push(filtros.dataFinal);
        }

        if (filtros.tamanho) {
            let sizeCondition;
            switch (filtros.tamanho) {
                case '1': sizeCondition = 'l.lvr_profundidade < 1'; break;
                case '2': sizeCondition = 'l.lvr_profundidade >= 1 AND l.lvr_profundidade < 2'; break;
                case '3': sizeCondition = 'l.lvr_profundidade >= 2'; break;
            }
            if (sizeCondition) conditions.push(sizeCondition);
        }

        if (filtros.paginasMax && !isNaN(filtros.paginasMax)) {
            conditions.push(`l.lvr_numero_de_paginas <= ?`);
            params.push(parseInt(filtros.paginasMax));
        }

        if (filtros.isbn) {
            conditions.push(`l.lvr_isbn = ?`);
            params.push(filtros.isbn);
        }

        if (filtros.codigoBarras) {
            conditions.push(`l.lvr_codigo_de_barras = ?`);
            params.push(filtros.codigoBarras);
        }

        // Combinar condições
        if (conditions.length > 0) {
            queryBase += ` WHERE ` + conditions.join(' AND ');
        }

        // Agrupar apenas por ID do livro
        queryBase += ` GROUP BY l.lvr_id`;
        
        const [livros] = await db.query(queryBase, params);
        return livros;
    } catch (err) {
        console.error(`Erro no consultaFiltroLivro - modelLivros: ${err}`);
        throw err;
    }
}

async function buscarTodosLivros() {
  try {
    const sql = `
      SELECT 
        l.lvr_id,
        l.lvr_titulo,
        l.lvr_edicao,
        l.lvr_sinopse,
        l.lvr_qtd_estoque,
        l.lvr_custo,
        GROUP_CONCAT(DISTINCT a.atr_nome SEPARATOR ', ') AS autores,
        GROUP_CONCAT(DISTINCT e.edi_nome SEPARATOR ', ') AS editoras
      FROM livros l
      LEFT JOIN escreveu es ON l.lvr_id = es.livros_lvr_id
      LEFT JOIN autor a ON es.autor_atr_id = a.atr_id
      LEFT JOIN editou ed ON l.lvr_id = ed.livros_lvr_id
      LEFT JOIN editora e ON ed.editora_edi_id = e.edi_id
      GROUP BY l.lvr_id
    `;

    const [livros] = await db.query(sql);
    return livros;
  } catch (err) {
    console.error(`Erro no buscarTodosLivros - modelLivros: ${err}`);
    throw err;
  }
}


async function buscarLivroId(lvr_id) {
    try {
        const [livro] = await db.query(
            `SELECT 
                l.*,
                GROUP_CONCAT(DISTINCT a.atr_nome SEPARATOR ', ') AS atr_nome,
                GROUP_CONCAT(DISTINCT e.edi_nome SEPARATOR ', ') AS edi_nome,
                GROUP_CONCAT(DISTINCT c.cat_nome SEPARATOR ', ') AS cat_nome
             FROM livros l
             LEFT JOIN escreveu es ON l.lvr_id = es.livros_lvr_id
             LEFT JOIN autor a ON es.autor_atr_id = a.atr_id
             LEFT JOIN editou ed ON l.lvr_id = ed.livros_lvr_id
             LEFT JOIN editora e ON ed.editora_edi_id = e.edi_id
             LEFT JOIN possui4 p ON l.lvr_id = p.livros_lvr_id
             LEFT JOIN categoria c ON p.categoria_cat_id = c.cat_id
             WHERE l.lvr_id = ?
             GROUP BY l.lvr_id`, 
            [lvr_id]
        );
        return livro[0];
    } catch (err) {
        console.error('Erro ao buscar livro por ID:', err);
        throw err;
    }
}

async function buscarEstoqueLivro(livroId) {
    const [[livro]] = await db.query(
        'SELECT lvr_qtd_estoque FROM livros WHERE lvr_id = ?', 
        [livroId]
    );
    return livro.lvr_qtd_estoque;
}

async function buscarCustoLivro(livroId) {
    const [[livro]] = await db.query(
        'SELECT lvr_custo FROM livros WHERE lvr_id = ?', 
        [livroId]
    );
    return livro.lvr_custo;
}

async function atualizarEstoqueLivro(livroId, novaQuantidade) {
    await db.query(
        'UPDATE livros SET lvr_qtd_estoque = ? WHERE lvr_id = ?',
        [novaQuantidade, livroId]
    );
}

async function buscarLivrosVendidos(dados) {
    // Garante que cat_ids seja um array (mesmo se vier como número, string única ou undefined)
    const cat_ids = Array.isArray(dados.cat_ids) 
        ? dados.cat_ids 
        : (dados.cat_ids ? [dados.cat_ids] : []);

    const inicio = dados.inicio;
    const fim = dados.fim;

    let sql = `
        SELECT
            l.lvr_id,
            l.lvr_titulo,
            cat.cat_id,
            SUM(itv.itv_qtd_item) AS total_vendido,
            DATE(t.tra_data) AS data_venda
        FROM 
            itens_de_venda itv
        INNER JOIN transacoes t ON itv.transacoes_tra_id = t.tra_id
        INNER JOIN livros l ON itv.livros_lvr_id = l.lvr_id
        INNER JOIN possui4 p ON l.lvr_id = p.livros_lvr_id
        INNER JOIN categoria cat ON p.categoria_cat_id = cat.cat_id
    `;

    const condicoes = ["t.tra_status IN ('APROVADO', 'EM TRANSPORTE', 'ENTREGUE')"];
    const valores = [];

    // Filtro por categorias (só aplica se houver IDs)
    if (cat_ids.length > 0) {
        const placeholders = cat_ids.map(() => '?').join(',');
        condicoes.push(`cat.cat_id IN (${placeholders})`);
        valores.push(...cat_ids);
    }

    // Filtro por data (ajuste para datas únicas)
    if (inicio && fim) {
        condicoes.push(`t.tra_data BETWEEN ? AND ?`);
        valores.push(`${inicio} 00:00:00`, `${fim} 23:59:59`);
    } else if (inicio) {
        condicoes.push(`t.tra_data >= ? AND t.tra_data <= ?`);
        valores.push(`${inicio} 00:00:00`, `${inicio} 23:59:59`);
    }

    // Combina condições
    if (condicoes.length > 0) {
        sql += ' WHERE ' + condicoes.join(' AND ');
    }

    sql += `
        GROUP BY
            l.lvr_id,
            l.lvr_titulo,
            cat.cat_id,
            DATE(t.tra_data)
        ORDER BY
            data_venda;
    `;

    try {
        const [livros] = await db.query(sql, valores);
        return livros;
    } catch (err) {
        console.error(`Erro no buscarLivrosVendidos - livroModel: ${err}`);
        throw err;
    }
}

module.exports = {
    buscarLivrosTitulo,
    consultaFiltroLivro,
    buscarLivroId,
    atualizarEstoqueLivro,
    buscarEstoqueLivro,
    buscarTodosLivros,
    buscarLivrosVendidos 
};