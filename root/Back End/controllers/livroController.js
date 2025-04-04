const {
    buscarLivrosTitulo,
    consultaFiltroLivro
} = require("../models/livroModel");

const { 
    buscarUsuarioId 
} = require("../models/usuarioModel");

module.exports.pesquisarLivrosTitulo = async (req, res) => {
    try {
        // 1. Primeiro extraia os parâmetros da query
        const { titulo, usr_id } = req.query;
        
        // 2. Validação do parâmetro obrigatório
        if (!titulo) {
            return res.status(400).render('pesquisarLivro', {
                livros: [],
                usuario: null,
                error: 'O parâmetro "titulo" é obrigatório'
            });
        }
        
        // 3. Busque os livros (agora a variável está corretamente declarada)
        const livros = await buscarLivrosTitulo(titulo);
        
        // 4. Busque o usuário se houver ID
        let usuario = null;
        if (usr_id) {
            usuario = await buscarUsuarioId(usr_id);
        }
        
        // 5. Renderize a view com todos os dados
        res.render('pesquisarLivro', {
            livros: livros || [], // Garante que sempre terá um array
            usuario: usuario || null, // Garante que será null se não houver usuário
            tituloPesquisado: titulo // Mantém o título pesquisado
        });
        
    } catch (err) {
        console.error('Erro ao pesquisar livros:', err);
        // Renderiza a view mesmo com erro, mas com mensagem
        res.status(500).render('pesquisarLivro', {
            livros: [],
            usuario: null,
            error: 'Erro ao carregar os livros'
        });
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
            categoria,
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
            LEFT JOIN "possui4" p ON l.lvr_id = p.livros_lvr_id
            LEFT JOIN categoria c ON p.categoria_cat_id = c.cat_id
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
                case '1': // Pequeno
                    sizeCondition = 'l.lvr_profundidade < 1';
                    break;
                case '2': // Médio
                    sizeCondition = 'l.lvr_profundidade >= 1 AND l.lvr_profundidade < 2';
                    break;
                case '3': // Grande
                    sizeCondition = 'l.lvr_profundidade >= 2';
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
        const livros = await consultaFiltroLivro(queryBase, params);

        // Retornar os resultados
        res.json(livros);
    } catch (error) {
        console.error('Erro ao filtrar livros:', error);
        res.status(500).json({ error: 'Erro interno ao processar a filtragem de livros' });
    }
};