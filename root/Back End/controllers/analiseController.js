const {buscarCategorias,
    buscarDatasVendas
} = require('../models/vendaModel');

module.exports.getHistoricoVendas = async (req, res) => {
    
    //Obtendo as categorias
    const categorias = await buscarCategorias();

    //Renderizando a página
    return res.render('analise', {
        categorias: categorias
    });
};

module.exports.getApiDatasVendas = async (req, res) => {
    
    //Obtendo as datas
    let datas = await buscarDatasVendas();

    //Formatando as datas
    datas = datas.map(data => {
        const dataFormatada = new Date(data.data_venda).toISOString().split('T')[0];
        return{
            data_venda: dataFormatada
        }
    })

    //Retornando os dados
    return res.json(datas);
};