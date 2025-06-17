const {buscarCategorias} = require('../models/vendaModel');

module.exports.getHistoricoVendas = async (req, res) => {
    
    //Obtendo as categorias
    const categorias = await buscarCategorias();

    //Renderizando a página
    return res.render('analise', {
        categorias: categorias
    });
};