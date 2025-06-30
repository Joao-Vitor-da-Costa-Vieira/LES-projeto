const {
    buscarLivrosTitulo,
    consultaFiltroLivro,
    buscarLivroId,
    buscarTodosLivros,
    buscarGrpPreco
} = require("../models/livroModel");


const {buscarNotificacoes
} = require("../models/usuario/notificacaoModel");

module.exports.pesquisarLivrosTitulo = async (req, res) => {
    try {
        const { titulo, usr_id } = req.query;
        
        if (!titulo) {
            return res.status(400).render('transacoes/usuario/pesquisarLivro', {
                livros: [],
                usuario: null,
                error: 'O parâmetro "titulo" é obrigatório'
            });
        }
        
        const livros = await buscarLivrosTitulo(titulo);

        for(const livro of livros){
            
            const grupo = await buscarGrpPreco(livro.grupo_de_precificacao_grp_id);

            livro.valor = (((grupo.grp_margem_lucro * 0.01) + 1) * livro.lvr_custo) * (1 + livro.lvr_desconto);
        }
        
        let notificacoes = [];
        if (usr_id) {
            notificacoes = await buscarNotificacoes(usr_id);
        }
        
        res.render('transacoes/usuario/pesquisarLivro', {
            livros: livros || [],
            tituloPesquisado: titulo,
            notificacoes
        });
        
    } catch (err) {
        console.error('Erro ao pesquisar livros:', err);

        res.status(500).render('transacoes/usuario/pesquisarLivro', {
            livros: [],
            usuario: null,
            error: 'Erro ao carregar os livros'
        });
    }
};

module.exports.livroPagina = async (req, res) => {
    try {
        const {lvr_id, usr_id} = req.query;
        
        if (!lvr_id || isNaN(lvr_id)) {
            return res.status(400).send('ID do livro inválido');
        }

        const livro = await buscarLivroId(lvr_id);
        
        if (!livro) {
            return res.status(404).render('paginaErro', {
                mensagem: 'Livro não encontrado'
            });
        }

        livro.emEstoque = livro.lvr_qtd_estoque > 0;

        const grupo = await buscarGrpPreco(livro.grupo_de_precificacao_grp_id);

        livro.valor = (((grupo.grp_margem_lucro * 0.01) + 1) * livro.lvr_custo) * (1 + livro.lvr_desconto);
        
        const notificacoes = usr_id ? await buscarNotificacoes(usr_id) : [];
        
        res.render('livrosPagina', { 
            livro,
            notificacoes
        });
    } catch (err) {
        console.error('Erro ao carregar página do livro:', err);
    }
};

module.exports.getApiTodosLivros = async (req, res) => {
    const livros = await buscarTodosLivros();

    console.log(livros);

    return res.json(livros);
};

module.exports.getApiFiltrarLivros = async (req, res) => {
    try {
        // Obter todos os parâmetros de query da requisição
        const filtros = JSON.parse(decodeURIComponent(req.query.filtros));

        console.log("filtros:", filtros);

        // Executar a query
        const livros = await consultaFiltroLivro(filtros);

        for(const livro of livros){
            
            const grupo = await buscarGrpPreco(livro.grupo_de_precificacao_grp_id);

            livro.valor = (((grupo.grp_margem_lucro * 0.01) + 1) * livro.lvr_custo) * (1 + livro.lvr_desconto);
        }

        // Verificar os resultados no console
        console.log('Resultados da query:', livros);
        
        res.json(livros);
    } catch (error) {
        console.error('Erro ao filtrar livros:', error);
        res.status(500).json({ error: 'Erro interno ao processar a filtragem de livros' });
    }
};

