const = {
    buscarLivrosTitulo
} = require("../models/livroModel");

const { 
    buscarUsuarioId 
} = require("../models/usuarioModel");

module.exports.pesquisarLivrosTitulo = async (req, res) => {
    const livros = await buscarLivrosTitulo(req.params.lvr_titulo);
    const usuario = await buscarUsuarioId(req.params.usr_nome);

    res.render('pesquisarLivro',{
        livros,
        usuario
    });
};