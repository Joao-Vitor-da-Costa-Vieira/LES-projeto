const {
    buscarItensCarrinho,
    deletarItensCarrinho,
    buscarItemCarrinho,
    alterarItemCarrinho,
    adicionarItemCarrinho
} = require("../models/carrinhoModel");

const { 
    buscarUsuarioId
} = require("../models/usuarioModel");

const {
    buscarLivroId
} = require("../models/livroModel");


module.exports.getCarrinho = async (req, res) => {
    try {
        const { usr_id } = req.query;
        console.log('Usuário recebido Carrinho:', usr_id);
        const usuario = await buscarUsuarioId(usr_id);
        console.log('Usuário recebido Carrinho:', usuario);
        const carrinhos = await buscarItensCarrinho(usr_id);
        
        const livrosComDetalhes = await Promise.all(
            carrinhos.map(async (carrinho) => {
                const livro = await buscarLivroId(carrinho.livros_lvr_id);
                return {
                    ...carrinho,
                    livro: livro
                };
            })
        );

        const subtotalTotal = livrosComDetalhes.reduce((total, item) => {
            return total + (item.livro.lvr_custo * item.car_qtd_item);
        }, 0);
        
        res.render('carrinho', { 
            itensCarrinho: livrosComDetalhes,
            subtotalTotal,
            usuario: usuario || null
        });
    } catch (err) {
        console.error('Erro ao carregar página do carrinho:', err);
        res.status(500).send('Erro ao carregar carrinho');
    }
};

module.exports.adicionarCarrinho = async (req, res) => {
    try {
        await adicionarItemCarrinho(
            req.body.usr_id, 
            req.body.lvr_id, 
            req.body.quantidade
        );
        res.status(200).json({ 
            success: true, 
            message: 'Item adicionado ao carrinho com sucesso' 
        });
    } catch (err) {
        console.error(`Erro no adicionarCarrinho - controllerCarrinho: ${err}`);
        res.status(400).json({ 
            success: false, 
            message: err.message || 'Erro ao adicionar item ao carrinho' 
        });
    }
};

module.exports.alterarCarrinho = async (req, res) => {
    try {
        const carrinhos = await alterarItemCarrinho(
            req.body.usr_id, 
            req.body.lvr_id, 
            req.body.quantidade
        );
        
        const livrosComDetalhes = await Promise.all(
            carrinhos.map(async (carrinho) => {
                const livro = await buscarLivroId(carrinho.livros_lvr_id);
                return {
                    ...carrinho,
                    livro: livro
                };
            })
        );
        
        res.json({
            success: true,
            itensCarrinho: livrosComDetalhes,
            message: 'Quantidade atualizada com sucesso'
        });

    } catch (err) {
        console.error(`Erro no alterarCarrinho - controllerCarrinho: ${err}`);
        res.status(400).json({ 
            success: false, 
            message: err.message || 'Erro ao alterar item no carrinho' 
        });
    }
};

module.exports.deletarCarrinho = async (req, res) => {
    try {
        const { car_id } = req.query;

        const usr_id = await deletarItensCarrinho(car_id);
        const carrinhos = await buscarItensCarrinho(usr_id);
        
        const livrosComDetalhes = await Promise.all(
            carrinhos.map(async (carrinho) => {
                const livro = await buscarLivroId(carrinho.livros_lvr_id);
                return {
                    ...carrinho,
                    livro: livro
                };
            })
        );
        
        res.json({
            success: true,
            itensCarrinho: livrosComDetalhes,
            message: 'Item removido do carrinho com sucesso'
        });
    } catch (err) {
        console.error(`Erro no deletarCarrinho - controllerCarrinho: ${err}`);
        res.sendStatus(500);
    }
};

module.exports.getAPICarrinho = async (req, res) => {
    const [carrinho] = await buscarItemCarrinho(req.body.usr_id, req.body.lvr_id);
    res.json(carrinho);
};