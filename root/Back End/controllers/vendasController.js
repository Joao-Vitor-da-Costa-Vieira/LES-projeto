const {
    processarPagamentoCompleto,
    buscarTransacao,
    buscarFormasPagamento,
    buscarTransacoesPrioridade,
    buscarTransacoesFiltradas,
    buscarTransacaoPorId,
    buscarItensVendaPorTransacao
} = require("../models/vendaModel");

const {
    buscarItensCarrinho
} = require("../models/carrinhoModel");

const {
    buscarEnderecosEntregaUsuarioId,
    buscarEnderecoEntregaPorTransacao
} = require("../models/endEntregaModel");

const {
    buscarCartoesUsuarioId
} = require("../models/cartaoModel");

const { 
    buscarUsuarioId
} = require("../models/usuarioModel");

const {
    buscarLivroId
} = require("../models/livroModel");

const {buscarItensCupom
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


module.exports.getHistorico = async (req, res) => {
    const { usr_id } = req.query;

    try {
        const [usuario] = await buscarUsuarioId(usr_id);
        const transacoes = await buscarTransacao(usr_id);

        if (!Array.isArray(transacoes)) {
            throw new Error('Formato inválido de transações retornado');
        }


        console.log('Tipo de transacoes:', typeof transacoes);
        console.log('Conteúdo de transacoes:', transacoes);


        // Buscar formas de pagamento para cada transação
        const transacoesCompletas = await Promise.all(
            transacoes.map(async (transacao) => {
                const formasPagamento = await buscarFormasPagamento(transacao.tra_id);
                console.log(formasPagamento);
                return {
                    ...transacao,
                    formasPagamento,
                    endereco: {
                        logradouro: transacao.end_endereco,
                        numero: transacao.end_numero,
                        complemento: transacao.end_complemento,
                        bairro: transacao.end_bairro,
                        cidade: transacao.end_cidade,
                        estado: transacao.end_estado,
                        cep: transacao.end_cep
                    }
                };
            })
        );

        res.render('historico', {
            usuario: usuario,
            transacoes: transacoesCompletas
        });
        
    } catch (error) {
        console.error('Erro ao buscar histórico:', error);
        res.status(500).send('Erro ao carregar histórico');
    }
};

module.exports.getPedidos = async (req, res) => {
    try {
        const transacoes = await buscarTransacoesPrioridade();
        
        const transacoesComUsuarios = await Promise.all(
            transacoes.map(async (transacao) => {
                const [usuario] = await buscarUsuarioId(transacao.usuarios_usr_id);
                return {
                    ...transacao,
                    usuario: usuario
                };
            })
        );

        res.render('pedidos', {
            transacoes: transacoesComUsuarios
        });

    } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        res.status(500).send('Erro ao carregar pedidos');
    }
};

module.exports.getPedidoItem = async (req, res) => {
    try {
        const { tra_id } = req.query;

        // Buscar dados básicos da transação
        const transacao = await buscarTransacaoPorId(tra_id);
        console.log('Transação:', transacao); 

        // Buscar itens da venda com detalhes dos livros
        const itens = await buscarItensVendaPorTransacao(tra_id);
        console.log('Itens:', itens); 

        // Buscar endereço de entrega
        const endereco = await buscarEnderecoEntregaPorTransacao(tra_id);
        
        // Buscar formas de pagamento
        const formaPagamentos = await buscarFormasPagamento(tra_id);
        
        // Buscar dados do usuário
        const [usuario] = await buscarUsuarioId(transacao.usuarios_usr_id);
        console.log('Usuário encontrado:', usuario);

        res.render('itemPedidoAdm', {
            transacao,
            usuario,
            endereco,
            formaPagamentos,
            itens
        });

    } catch (error) {
        console.error('Erro ao buscar detalhes do pedido:', error);
        res.status(500).send('Erro ao carregar detalhes do pedido');
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
        const totalCalculado = parseFloat((subtotal).toFixed(2));
        const totalPago = parseFloat(pagamentos.reduce((sum, p) => sum + p.valor, 0).toFixed(2));
        
        if (totalPago !== totalCalculado) {
            return res.status(400).json({ 
                message: `Valor pago (R$ ${totalPago}) não corresponde ao total (R$ ${totalCalculado})`
            });
        }

        // 5. Processar pagamento
        const tra_id = await processarPagamentoCompleto({
            usuarioId,
            enderecoId,
            data,
            subtotal,
            frete,
            total: totalCalculado,
            pagamentos,
            itensCarrinho
        });

        res.status(200).json({ tra_id });
        
    } catch (error) {
        console.error('Erro no pagamento:', error);
        res.status(500).json({ message: error.message || 'Erro no processamento' });
    }
};

module.exports.filterPedidos = async (req, res) => {
    try {
        const filters = req.query;
        
        const transacoesFiltradas = await buscarTransacoesFiltradas(filters);

        const transacoesComUsuarios = transacoesFiltradas.map(transacao => ({
            ...transacao,
            usuario: {
                usr_nome: transacao.usr_nome
            }
        }));

        res.json(transacoesComUsuarios);

    } catch (error) {
        console.error('Erro ao filtrar pedidos:', error);
        res.status(500).json({ error: 'Erro ao filtrar pedidos' });
    }
};
