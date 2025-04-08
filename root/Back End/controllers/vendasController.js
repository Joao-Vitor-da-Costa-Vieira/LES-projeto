const {
    criarItemVenda,
    criarTransacao,
    buscarTransacao,
    buscarTransacaoId
} = require("../models/vendaModel");

const {
    buscarItensCarrinho,
    limparCarrinhoUsuario
} = require("../models/carrinhoModel");

const {
    buscarEnderecosEntregaUsuarioId
} = require("../models/endEntregaModel");

const {
    buscarCartoesUsuarioId
} = require("../models/cartaoModel");

const { 
    buscarUsuarioId
} = require("../models/usuarioModel");

const {
    buscarLivroId,
    buscarEstoqueLivro
} = require("../models/livroModel");

module.exports.getPagamento = async (req, res) => {
    try {
        const { usr_id } = req.query;

        console.log('Usuário recebido Pagamento:', usr_id); 

        const [usuario, carrinhos, enderecos, cartoes] = await Promise.all([
            buscarUsuarioId(usr_id),
            buscarItensCarrinho(usr_id),
            buscarEnderecosEntregaUsuarioId(usr_id),
            buscarCartoesUsuarioId(usr_id)
        ]);

        console.log('Usuário recebido Pagamento:', usuario);
        console.log('Cartoes recebidos Pagamento:', cartoes);  

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

const db = require('../config/db');

module.exports.getHistorico = async (req, res) => {
    const { usr_id } = req.query;

    try {
        const [usuario] = await buscarUsuarioId(usr_id);

        const [transacoes] = await buscarTransacao(usr_id);

        res.render('historico', {
            usuario: usuario[0],
            transacoes
        });
    } catch (error) {
        console.error('Erro ao buscar histórico:', error);
        res.status(500).send('Erro ao carregar histórico');
    }
};

module.exports.postPagamento = async (req, res) => {
    const { usuarioId, enderecoId, data, subtotal, frete, pagamentos } = req.body;
    
    console.log("controller:", usuarioId, enderecoId, data, subtotal, frete, pagamentos);

    try {
        const itensCarrinho = await buscarItensCarrinho(usuarioId);
        
        for (const item of itensCarrinho) {
            const estoqueAtual = await buscarEstoqueLivro(item.livros_lvr_id);
            if (item.car_qtd_item > estoqueAtual) {
                return res.status(400).json({ 
                    message: `Estoque insuficiente para o livro ${item.livro.lvr_titulo}. 
                    Quantidade disponível: ${estoqueAtual}`
                });
            }
        }

        await db.query('START TRANSACTION');

        let primeiraTransacaoId = 0;
        const numeroVenda = 1001;
        const status = "EM PROCESSAMENTO";
    

            for (const pagamento of pagamentos) {
                const transacaoId = await criarTransacao(
                    numeroVenda,
                    data,
                    frete,
                    pagamento.tipo,
                    status,
                    pagamento.valor,
                    subtotal,
                    enderecoId,
                    usuarioId
                );

                if (primeiraTransacaoId === 0) {
                    primeiraTransacaoId = buscarTransacaoId(usuarioId);
                    
                    for (const item of itensCarrinho) {
                        await criarItemVenda(
                            item.car_qtd_item,
                            transacaoId,
                            item.livros_lvr_id
                        );
                        
                        const novoEstoque = item.livro.lvr_qtd_estoque - item.car_qtd_item;
                        await atualizarEstoqueLivro(item.livros_lvr_id, novoEstoque);
                    }
                    isFirstTransaction = false;
                }
            }

        await limparCarrinhoUsuario(usuarioId);
        await db.query('COMMIT');

        res.status(200).json({ vendaId: primeiraTransacaoId });
    } catch (error) {
        await db.query('ROLLBACK');
        console.error('Erro ao confirmar pagamento:', error);
        res.status(500).json({ message: 'Pagamento Confirmado' });
    }
};