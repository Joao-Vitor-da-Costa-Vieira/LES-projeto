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

        const [carrinho] = await buscarItensCarrinho(usr_id);
        
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

        await adicionarItemCarrinho(req.body.usr_id, req.body.lvr_id, req.body.quantidade);
        res.sendStatus(204);
        
    } catch (err) {
        console.error(`Erro no adicionarCarrinho - controllerCarrinho: ${err}`);
        res.sendStatus(500);
    }
};

module.exports.atualizarCarrinho = async (req, res) => {
    try {
        await atualizarItensCarrinho(req.body.car_id, req.body.quantidade);
        res.sendStatus(200);        
    } catch (err) {
        console.error(`Erro no atualizarCarrinho - controllerCarrinho: ${err}`);
        res.sendStatus(500);
    }
};

module.exports.deletarCarrinho = async (req, res) => {
    try {
        await deletarItensCarrinho(req.body.car_id);
        res.sendStatus(204);        
    } catch (err) {
        console.error(`Erro no deletarCarrinho - controllerCarrinho: ${err}`);
        res.sendStatus(500);
    }
};

module.exports.getAPICarrinho = async (req, res) => {
    const [carrinho] = await buscarItemCarrinho(req.body.usr_id, req.body.lvr_id);
    res.json(carrinho);
};