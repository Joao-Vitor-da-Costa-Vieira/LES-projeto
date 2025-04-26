const {
    processarPagamentoCompleto,
    buscarTransacaoId,
    buscarTransacao
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
    buscarEstoqueLivro,
    atualizarEstoqueLivro
} = require("../models/livroModel");

const {buscarItensCupom,
    deletarItensCupom,
    adicionarItemCupom
 }= require("../models/cupomModel");

module.exports.getPagamento = async (req, res) => {
    try {
        const { usr_id } = req.query;

        console.log('Usuário recebido Pagamento:', usr_id); 

        const [usuario, carrinhos, enderecos, cartoes, cupons] = await Promise.all([
            buscarUsuarioId(usr_id),
            buscarItensCarrinho(usr_id),
            buscarEnderecosEntregaUsuarioId(usr_id),
            buscarCartoesUsuarioId(usr_id),
            buscarItensCupom(usr_id)
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
            cupons: cupons,
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
    const { usuarioId, enderecoId, data, subtotal, frete, pagamentos, total } = req.body;
    
    try {
        // 1. Buscar itens do carrinho (formato original)
        const itensCarrinho = await buscarItensCarrinho(usuarioId);
        
        // 2. Validar estoque e obter detalhes dos livros
        const itensDetalhados = [];
        for (const item of itensCarrinho) {
            const livro = await buscarLivroId(item.livros_lvr_id);
            
            if (item.car_qtd_item > livro.lvr_qtd_estoque) {
                return res.status(400).json({ 
                    message: `Estoque insuficiente para ${livro.lvr_titulo} (Disponível: ${livro.lvr_qtd_estoque})`
                });
            }
            
            itensDetalhados.push({
                ...item,
                livro
            });
        }

        // 3. Validar cupons
        const cuponsUsados = pagamentos.filter(p => p.tipo === '2' || p.tipo === '3');
        if (cuponsUsados.length > 2) {
            return res.status(400).json({ message: 'Máximo de 2 cupons por compra' });
        }

        // 4. Validar valores
        const totalCalculado = parseFloat((subtotal + frete).toFixed(2));
        const totalPago = parseFloat(pagamentos.reduce((sum, p) => sum + p.valor, 0).toFixed(2));
        
        if (totalPago !== totalCalculado) {
            return res.status(400).json({ 
                message: `Valor pago (R$ ${totalPago}) não corresponde ao total (R$ ${totalCalculado})`
            });
        }

        // 5. Processar pagamento (mantendo o formato original do carrinho)
        const tra_id = await processarPagamentoCompleto({
            usuarioId,
            enderecoId,
            data,
            subtotal,
            frete,
            total: totalCalculado,
            pagamentos,
            itensCarrinho // Envia os itens no formato original
        });

        res.status(200).json({ tra_id });
        
    } catch (error) {
        console.error('Erro no pagamento:', error);
        res.status(500).json({ message: error.message || 'Erro no processamento' });
    }
};