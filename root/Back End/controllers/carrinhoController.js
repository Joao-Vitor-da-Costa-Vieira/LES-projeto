const {
    buscarItensCarrinho,
    deletarItensCarrinho,
    atualizarItensCarrinho,
    buscarItemCarrinho
} = require("../models/carrinhoModel");

module.exports.getCarrinho = async (req, res) => {
    try {
        const usuario = req.params.usr_id;

        const [carrinho] = await buscarItemCarrinho(usr_id);
        
        res.render('carrinho', { 
            carrinho,
            usuario: usuario || null
        });
    } catch (err) {
        console.error('Erro ao carregar página do carrinho:', err);
    }
};