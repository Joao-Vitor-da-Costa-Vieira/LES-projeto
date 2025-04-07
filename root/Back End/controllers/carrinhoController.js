const {
    buscarItensCarrinho,
    deletarItensCarrinho,
    atualizarItensCarrinho,
    buscarItemCarrinho,
    adicionarItemCarrinho
} = require("../models/carrinhoModel");

module.exports.getCarrinho = async (req, res) => {
    try {
        const usuario = req.body.usr_id;

        const [carrinho] = await buscarItemCarrinho(usr_id);
        
        res.render('carrinho', { 
            carrinho,
            usuario: usuario || null
        });
    } catch (err) {
        console.error('Erro ao carregar página do carrinho:', err);
    }
};

module.exports.adicionarCarrinho = async (req, res) => {
    try {

        await adicionarItemCarrinho(req.body.usr_id,req. body.lvr_id, req.body.quantidade);
        res.sendStatus(204);
        
    } catch (err) {
        console.error(`Erro no adicionarCarinho - controllerCarrinho: ${err}`);
        res.sendStatus(500);
    }
};