const {
    buscarLivrosTitulo,
    consultaFiltroLivro,
    buscarLivroId,
    buscarTodosLivros
} = require("../models/livroModel");

const { 
    buscarUsuarioId 
} = require("../models/usuario/usuarioModel");

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
        
        let usuario = null;
        if (usr_id) {
            usuario = await buscarUsuarioId(usr_id);
        }
        
        let notificacoes = [];
        if (usuario) {
            notificacoes = await buscarNotificacoes(usuario.usr_id);
        }
        
        res.render('transacoes/usuario/pesquisarLivro', {
            livros: livros || [],
            usuario: usuario,
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
        
        const notificacoes = usuario ? await buscarNotificacoes(usuario.usr_id) : [];
        
        res.render('livrosPagina', { 
            livro,
            usuario,
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

        // Verificar os resultados no console
        console.log('Resultados da query:', livros);
        
        res.json(livros);
    } catch (error) {
        console.error('Erro ao filtrar livros:', error);
        res.status(500).json({ error: 'Erro interno ao processar a filtragem de livros' });
    }
};

