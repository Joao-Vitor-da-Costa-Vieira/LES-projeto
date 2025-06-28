const {
    buscarCategorias,
    buscarDatasVendas
} = require('../../models/transacoes/vendaModel');

const {buscarLivrosVendidos 
} = require('../../models/livroModel');

const { 
    buscarAdmId 
} = require('../../models/admModels');

module.exports.getAnalise = async (req, res) => {
    
    const { adm_id } = req.query;

    const adm = await buscarAdmId(adm_id);
    
    //Obtendo as categorias
    const categorias = await buscarCategorias();

    //Renderizando a página
    return res.render('transacoes/adm/analise', {
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

module.exports.getApiLivrosVendas = async (req, res) => {
    
    //Preparando os dados dos filtros
    const dados = {
        cat_ids: req.query.cat_id,
        inicio: req.query.inicio,
        fim: req.query.fim
    }
    
    //Buscando todos os dados dos livros para análise
    let livros = await buscarLivrosVendidos(dados);

    //Retornando dados json
    return res.json(livros);
};