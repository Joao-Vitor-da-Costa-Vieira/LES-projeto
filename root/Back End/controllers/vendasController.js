const {
    cadastrarVenda
} = require("../models/vendaModel");

const {
    buscarItensCarrinho
} = require("../models/carrinhoModel");

const {
    buscarEnderecosEntregaUsuarioId
} = require("../models/endEntregaModel");

const {
    buscarCartoesUsuarioId
} = require("../models/cartaoModel");

module.exports.getPagamento = async (req, res) => {
    try {
        const { usuario } = req.query;
        const carrinhos = await buscarItensCarrinho(usuario.usr_id);
        const enderecos = await buscarEnderecosEntregaUsuarioId(usuario.usr_id);
        const cartoes = await buscarCartoesUsuarioId(usuario.usr_id);

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
        
        res.render('pagamento', { 
            itensCarrinho: livrosComDetalhes,
            subtotalTotal,
            enderecos: enderecos,
            cartoes: cartoes,
            usuario: usuario
        });
    } catch (err) {
        console.error('Erro ao carregar página do carrinho:', err);
        res.status(500).send('Erro ao carregar carrinho');
    }
};