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

async function consultaFiltroLivro(query, params){
    try {
        console.log('Executando query:', query);
        console.log('Com parâmetros:', params);
        
        const [livros] = await db.query(`
                SELECT * FROM livros
            `);
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
        l.lvr_ano,
        l.lvr_titulo,
        l.lvr_edicao,
        l.lvr_isbn,
        l.lvr_numero_de_paginas,
        l.lvr_sinopse,
        l.lvr_altura,
        l.lvr_largura,
        l.lvr_peso,
        l.lvr_profundidade,
        l.lvr_codigo_de_barras,
        l.lvr_ponteiro_imagem,
        l.lvr_status,
        l.lvr_qtd_estoque,
        l.lvr_custo,
        l.lvr_desconto,
        l.lvr_justificativa,
        l.grupo_de_precificacao_grp_id,
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

async function atualizarEstoqueLivro(livroId, novaQuantidade) {
    await db.query(
        'UPDATE livros SET lvr_qtd_estoque = ? WHERE lvr_id = ?',
        [novaQuantidade, livroId]
    );
}

module.exports = {
    buscarLivrosTitulo,
    consultaFiltroLivro,
    buscarLivroId,
    atualizarEstoqueLivro,
    buscarEstoqueLivro,
    buscarTodosLivros 
};