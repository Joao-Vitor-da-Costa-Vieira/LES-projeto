const {
    processarPagamentoCompleto,
    buscarTransacao,
    buscarFormasPagamento,
    buscarTransacoesPrioridade,
    buscarTransacoesFiltradas,
    buscarTransacaoPorId,
    buscarItensVendaPorTransacao,
    atualizarTransacaoStatus,
    buscarUsuarioPorTransacao
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

const { 
    adicionarNotificacao,
    buscarNotificacoes 
} = require("../models/notificacaoModel");

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
        
        const notificacoes = usuario ? await buscarNotificacoes(usuario.usr_id) : [];

        res.render('pagamento', { 
            itensCarrinho: livrosComDetalhes,
            subtotalTotal,
            enderecos: enderecos,
            cartoes: cartoes,
            cupons: cupons,
            usuario: usuario,
            notificacoes
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

        const notificacoes = await buscarNotificacoes(usuario.usr_id);
        
        res.render('historico', {
            usuario,
            transacoes: transacoesCompletas,
            notificacoes
        });

        
    } catch (error) {
        console.error('Erro ao buscar histórico:', error);
        res.status(500).send('Erro ao carregar histórico');
    }
};

module.exports.getTransacao = async (req, res) => {
    try {
        const { tra_id } = req.query;

        // Buscar dados básicos da transação
        const transacao = await buscarTransacaoPorId(tra_id);
        
        // Buscar itens da venda com detalhes dos livros
        const itens = await buscarItensVendaPorTransacao(tra_id);
        
        // Buscar endereço de entrega
        const endereco = await buscarEnderecoEntregaPorTransacao(tra_id);
        
        // Buscar formas de pagamento
        const formaPagamentos = await buscarFormasPagamento(tra_id);
        
        // Buscar dados do usuário
        const usuarioTransacao = await buscarUsuarioPorTransacao(tra_id);
        const [usuario] = await buscarUsuarioId(usuarioTransacao.usuarios_usr_id);

        const notificacoes = await buscarNotificacoes(usuario.usr_id);

        res.render('transacao', {
            transacao,
            usuario,
            endereco,
            formaPagamentos,
            itens,
            notificacoes
        });

    } catch (error) {
        console.error('Erro ao buscar detalhes da transação:', error);
        res.status(500).send('Erro ao carregar detalhes da transação');
    }
};

module.exports.getTroca = async (req, res) => {
    try {
        const { tra_id } = req.query;
        
        // Buscar dados da transação original
        const { transacaoOriginal, itensOriginais, endereco } = await buscarDadosTroca(tra_id);
        
        // Preparar dados para a view
        const itensParaTroca = itensOriginais.map(item => ({
            livro: {
                ...item,
                lvr_desconto: item.lvr_desconto || 0
            },
            quantidade_maxima: item.itv_qtd_item,
            quantidade_selecionada: 0
        }));

        // Buscar dados do usuário
        const [usuario] = await buscarUsuarioId(transacaoOriginal.usuarios_usr_id);
        const notificacoes = await buscarNotificacoes(usuario.usr_id);

        res.render('selecaoTroca', {
            itensVenda: itensParaTroca,
            subtotalTotal: 0,
            usuario,
            endereco,
            notificacoes,
            tra_id_original: tra_id
        });

    } catch (error) {
        console.error('Erro ao carregar troca:', error);
        res.status(500).send('Erro ao carregar página de troca');
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

module.exports.postAtualizarStatus = async (req, res) => {
    try{
        const { tra_id, novoStatus } = req.body;
        const statusRequerEstoque = ['CANCELADO', 'REPROVADO', 'TROCA CONCLUIDA', 'DEVOLUÇÃO CONCLUÍDA'];

        let result;

        if (statusRequerEstoque.includes(novoStatus)) {
           result = await atualizarStatusEReporEstoque(tra_id, novoStatus);
        } else {
           result = await atualizarTransacaoStatus(novoStatus, tra_id);
        }

        console.log(tra_id);
        console.log(novoStatus);

        const transacao = await buscarTransacaoPorId(tra_id);
        
        const usuario = await buscarUsuarioPorTransacao(tra_id);

        if (novoStatus === 'TROCA CONCLUIDA') {
            const cupomData = {
                usr_id: usuario.usuarios_usr_id,
                valor: transacao.tra_subtotal,
                nome: 'Cupom de Troca',
                data: new Date().toISOString().split('T')[0]
            };

            await adicionarItemCupom(
                cupomData.usr_id,
                cupomData.valor,
                cupomData.nome,
                cupomData.data
            );
        }

        let mensagem = `A sua transação do dia ${transacao.tra_data_formatada} de valor R$ ${transacao.tra_subtotal} foi `;

        switch(novoStatus) {
            case 'APROVADO':
                mensagem += 'APROVADA!';
                break;
            case 'REPROVADO':
                mensagem += 'REPROVADA!';
                break;
            case 'CANCELADO':
                mensagem += 'CANCELADA!';
                break;
            case 'EM TRANSPORTE':
                mensagem += 'COLOCADA EM TRANSPORTE!';
                break;
            case 'ENTREGUE':
                mensagem += 'ENTREGUE!';
                break;
            case 'TROCA RECUSADA':
                mensagem += 'TROCA RECUSADA!';
                break;
            case 'TROCA APROVADA':
                mensagem += 'TROCA APROVADA! Um cupom será gera após o recebimento dos livros.';
                break;
            case 'TROCA CANCELADA':
                mensagem += 'TROCA CANCELADA!';
                break;
            case 'TROCA CONCLUIDA':
                mensagem += `TROCA CONCLUÍDA! Um Cupom de Troca de R$ ${transacao.tra_subtotal} foi gerado.`;
                break;
            case 'DEVOLUÇÃO CANCELADA':
                mensagem += 'DEVOLUÇÃO CANCELADA!';
                break;
            case 'DEVOLUÇÃO RECUSADA':
                mensagem += 'DEVOLUÇÃO RECUSADA!';
                break;
            case 'DEVOLUÇÃO APROVADA':
                mensagem += 'DEVOLUÇÃO APROVADA!';
                break;
            case 'DEVOLUÇÃO CONCLUÍDA':
                mensagem += 'DEVOLUÇÃO CONCLUÍDA!';
                break;
            default:
                break;
        }

        await adicionarNotificacao(usuario.usuarios_usr_id, mensagem, tra_id);
        
        res.status(200).json({
            success: true,
            novoStatus: novoStatus,
            message: mensagem,
            result: result
        });

    } catch (error){
        console.error('Erro na atualização de Status:', error);
        res.status(500).json({ message: error.message || 'Erro no processamento' });
    }
};

module.exports.filtrarPedidos = async (req, res) => {
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

module.exports.postTroca = async (req, res) => {
    try {
        const { usuarioId, tra_id_original, itens, subtotal, end_id } = req.body;

        // Validar estrutura dos dados
        if (!itens || !Array.isArray(itens)){
            throw new Error('Dados de itens inválidos');
        }

        // Criar nova troca
        const novaTraId = await criarTroca(usuarioId, {
            tra_id_original,
            itens,
            subtotal,
            end_id
        });

        // Adicionar notificação
        await adicionarNotificacao(
            usuarioId,
            `Troca solicitada para o pedido #${tra_id_original}. Status: TROCA SOLICITADA`,
            novaTraId
        );

        res.status(200).json({
            success: true,
            tra_id: novaTraId,
            message: 'Troca solicitada com sucesso'
        });

    } catch (error) {
        console.error('Erro ao processar troca:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};