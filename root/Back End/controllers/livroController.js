const = {
    buscarLivrosTitulo
} = require("../models/livroModel");

module.exports.pesquisarLivrosTitulo = async (req, res) => {
    const livros = await buscarLivrosTitulo(req.params.lvr_titulo);
    res.json(livros);
};