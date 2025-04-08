const {
    buscarLivrosTitulo,
    consultaFiltroLivro,
    buscarLivroId
} = require("../models/livroModel");

const { 
    buscarUsuarioId 
} = require("../models/usuarioModel");

module.exports.pesquisarLivrosTitulo = async (req, res) => {
    try {
        const { titulo, usr_id } = req.query;
        
        if (!titulo) {
            return res.status(400).render('pesquisarLivro', {
                livros: [],
                usuario: null,
                error: 'O parâmetro "titulo" é obrigatório'
            });
        }
        
        const livros = await buscarLivrosTitulo(titulo);
        
        let usuario = null;
        if (usr_id) {
            usuario = await buscarUsuarioId(usr_id);
        }
        
        res.render('pesquisarLivro', {
            livros: livros || [], 
            usuario: usuario,
            tituloPesquisado: titulo
        });
        
    } catch (err) {
        console.error('Erro ao pesquisar livros:', err);

        res.status(500).render('pesquisarLivro', {
            livros: [],
            usuario: null,
            error: 'Erro ao carregar os livros'
        });
    }
};

module.exports.livroPagina = async (req, res) => {
    try {
        const lvr_id = req.params.lvr_id;
        
        if (!lvr_id || isNaN(lvr_id)) {
            return res.status(400).send('ID do livro inválido');
        }

        const [livro, usuario] = await Promise.all([
            buscarLivroId(lvr_id),
            buscarUsuarioId(1)
        ]);
        
        if (!livro) {
            return res.status(404).render('paginaErro', {
                mensagem: 'Livro não encontrado'
            });
        }

        livro.emEstoque = livro.lvr_qtd_estoque > 0;
        
        res.render('livrosPagina', { 
            livro,
            usuario: usuario
        });
    } catch (err) {
        console.error('Erro ao carregar página do livro:', err);
    }
};

module.exports.getApiFiltrarLivros = async (req, res) => {
    try {
        // Obter todos os parâmetros de query da requisição
        const { titulo, precoMax, autor, editora, categoria, dataInicio, dataFinal, tamanho, paginasMax, isbn, codigoBarras } = req.query;

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
        if (titulo) {
            conditions.push(`l.lvr_titulo LIKE ?`);
            params.push(`%${titulo}%`);
        }

        if (precoMax && !isNaN(precoMax)) {
            conditions.push(`l.lvr_custo <= ?`);
            params.push(parseFloat(precoMax));
        }

        if (autor) {
            conditions.push(`a.atr_nome LIKE ?`);
            params.push(`%${autor}%`);
        }

        if (editora) {
            conditions.push(`et.edi_nome LIKE ?`);
            params.push(`%${editora}%`);
        }

        if (categoria) {
            conditions.push(`c.cat_nome LIKE ?`);
            params.push(`%${categoria}%`);
        }

        if (dataInicio) {
            conditions.push(`l.lvr_ano >= ?`);
            params.push(dataInicio);
        }

        if (dataFinal) {
            conditions.push(`l.lvr_ano <= ?`);
            params.push(dataFinal);
        }

        if (tamanho) {
            let sizeCondition;
            switch (tamanho) {
                case '1': sizeCondition = 'l.lvr_profundidade < 1'; break;
                case '2': sizeCondition = 'l.lvr_profundidade >= 1 AND l.lvr_profundidade < 2'; break;
                case '3': sizeCondition = 'l.lvr_profundidade >= 2'; break;
            }
            if (sizeCondition) conditions.push(sizeCondition);
        }

        if (paginasMax && !isNaN(paginasMax)) {
            conditions.push(`l.lvr_numero_de_paginas <= ?`);
            params.push(parseInt(paginasMax));
        }

        if (isbn) {
            conditions.push(`l.lvr_isbn = ?`);
            params.push(isbn);
        }

        if (codigoBarras) {
            conditions.push(`l.lvr_codigo_de_barras = ?`);
            params.push(codigoBarras);
        }

        // Combinar condições
        if (conditions.length > 0) {
            queryBase += ` WHERE ` + conditions.join(' AND ');
        }

        // Agrupar apenas por ID do livro
        queryBase += ` GROUP BY l.lvr_id`;

        // Executar a query
        const livros = await consultaFiltroLivro(queryBase, params);

        // Verificar os resultados no console
        console.log('Resultados da query:', livros);
        
        res.json(livros);
    } catch (error) {
        console.error('Erro ao filtrar livros:', error);
        res.status(500).json({ error: 'Erro interno ao processar a filtragem de livros' });
    }
};

