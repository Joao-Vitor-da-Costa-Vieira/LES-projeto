const {
    buscarItensCarrinho,
    deletarItensCarrinho,
    atualizarItensCarrinho,
    buscarItemCarrinho,
    adicionarItemCarrinho
} = require("../models/carrinhoModel");

const {
    buscarLivroId
} = require("../models/livroModel");

module.exports.getCarrinho = async (req, res) => {
    try {
        const usuario = req.query;
        const carrinhos = await buscarItensCarrinho(usuario.usr_id);
        
        const livrosComDetalhes = await Promise.all(
            carrinhos.map(async (carrinho) => {
                const livro = await buscarLivroId(carrinho.livros_lvr_id);
                return {
                    ...carrinho,
                    livro: livro
                };
            })
        );
        
        res.render('carrinho', { 
            itensCarrinho: livrosComDetalhes,
            usuario: usuario || null
        });
    } catch (err) {
        console.error('Erro ao carregar página do carrinho:', err);
        res.status(500).send('Erro ao carregar carrinho');
    }
};

module.exports.adicionarCarrinho = async (req, res) => {
    try {
        const resultado = await adicionarItemCarrinho(
            req.body.usr_id, 
            req.body.lvr_id, 
            req.body.quantidade
        );
        res.status(200).json(resultado);
    } catch (err) {
        console.error(`Erro no adicionarCarrinho - controllerCarrinho: ${err}`);
        res.status(400).json({ 
            success: false, 
            message: err.message || 'Erro ao adicionar item ao carrinho' 
        });
    }
};

module.exports.atualizarCarrinho = async (req, res) => {
    try {
        await atualizarItensCarrinho(
            req.body.car_id,
            req.body.quantidade
            );
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