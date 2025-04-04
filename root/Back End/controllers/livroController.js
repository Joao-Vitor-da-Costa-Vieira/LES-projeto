const {
    buscarLivrosTitulo
} = require("../models/livroModel");

const { 
    buscarUsuarioId 
} = require("../models/usuarioModel");

module.exports.pesquisarLivrosTitulo = async (req, res) => {
    try {
        const { titulo, usr_id } = req.query;
        
        const livros = await buscarLivrosTitulo(titulo);
        const usuario = await buscarUsuarioId(usr_id);
        
        res.render('pesquisarLivro', { 
            livros, 
            usuario 
        });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao pesquisar livros' });
    }
};

module.exports.getApiFiltrarLivros = async (req, res) => {
    try {
        // Obter todos os parâmetros de query da requisição
        const {
            titulo,
            precoMax,
            autor,
            editora,
            dataInicio,
            dataFinal,
            tamanho,
            paginasMax,
            isbn,
            codigoBarras
        } = req.query;

        // Iniciar a construção da query
        let queryBase = `
            SELECT l.* 
            FROM livros l
            LEFT JOIN escreveu e ON l.lvr_id = e.livros_lvr_id
            LEFT JOIN autor a ON e.autor_atr_id = a.atr_id
            LEFT JOIN editou ed ON l.lvr_id = ed.livros_lvr_id
            LEFT JOIN editora et ON ed.editora_edi_id = et.edi_id
        `;

        const conditions = [];
        const params = [];

        // Adicionar condições para cada filtro fornecido
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
                case '1': // Pequeno
                    sizeCondition = 'l.lvr_profundidade < 15';
                    break;
                case '2': // Médio
                    sizeCondition = 'l.lvr_profundidade >= 15 AND l.lvr_profundidade < 25';
                    break;
                case '3': // Grande
                    sizeCondition = 'l.lvr_profundidade >= 25';
                    break;
            }
            if (sizeCondition) {
                conditions.push(sizeCondition);
            }
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

        // Combinar todas as condições com AND
        if (conditions.length > 0) {
            queryBase += ` WHERE ` + conditions.join(' AND ');
        }

        // Adicionar GROUP BY para evitar duplicatas devido aos JOINs
        queryBase += ` GROUP BY l.lvr_id`;

        // Chamar o model para executar a query
        const livros = await LivroModel.consultaFiltroLivro(queryBase, params);

        // Retornar os resultados
        res.json(livros);
    } catch (error) {
        console.error('Erro ao filtrar livros:', error);
        res.status(500).json({ error: 'Erro interno ao processar a filtragem de livros' });
    }
};