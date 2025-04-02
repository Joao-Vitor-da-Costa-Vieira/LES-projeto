const = {
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

        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.json({ livros, usuario });
        }
        
        res.render('pesquisarLivro', { livros, usuario });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao pesquisar livros' });
    }
};