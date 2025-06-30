const {
    processarPagamentoCompleto,
    buscarTransacao,
    buscarFormasPagamento,
    buscarTransacoesPrioridade,
    buscarTransacoesFiltradas,
    buscarTransacaoPorId,
    buscarItensVendaPorTransacao,
    atualizarTransacaoStatus,
    buscarUsuarioPorTransacao,
    atualizarStatusEReporEstoque,
    getPedidosUsuario
} = require("../../models/transacoes/vendaModel");

const {
    cancelarTransacaoAssociada
} = require('../../models/transacoes/trocasModel');

const {
    buscarItensCarrinho
} = require("../../models/transacoes/carrinhoModel");

const {
    buscarEnderecosEntregaUsuarioId,
    buscarEnderecoEntregaPorTransacao
} = require("../../models/usuario/endEntregaModel");

const {
    buscarCartoesUsuarioId
} = require("../../models/usuario/cartaoModel");

const { 
    buscarUsuarioId
} = require("../../models/usuario/usuarioModel");

const {
    buscarLivroId,
    buscarGrpPreco
} = require("../../models/livroModel");

const {buscarItensCupom,
    adicionarItemCupom
}= require("../../models/usuario/cupomModel");

const { 
    adicionarNotificacao,
    buscarNotificacoes 
} = require("../../models/usuario/notificacaoModel");

const { 
    buscarAdmId 
}= require("../../models/admModels");

module.exports.getPagamento = async (req, res) => {
    try {
        const { usr_id } = req.query;

        console.log('Usuário recebido Pagamento:', usr_id); 

        const [carrinhos, enderecos, cartoes, cupons] = await Promise.all([
            buscarItensCarrinho(usr_id),
            buscarEnderecosEntregaUsuarioId(usr_id),
            buscarCartoesUsuarioId(usr_id),
            buscarItensCupom(usr_id)
        ]);


        console.log('Cartoes recebidos Pagamento:', cartoes);  

        const livrosComDetalhes = await Promise.all(
            carrinhos.map(async (carrinho) => {
                const livro = await buscarLivroId(carrinho.livros_lvr_id);

                const grupo = await buscarGrpPreco(livro.grupo_de_precificacao_grp_id);

                livro.valor = (((grupo.grp_margem_lucro * 0.01) + 1) * livro.lvr_custo) * (1 + livro.lvr_desconto);

                return {
                    ...carrinho,
                    livro: livro
                };
            })
        );

        const subtotalTotal = livrosComDetalhes.reduce((total, item) => {
            return total + (item.livro.valor * item.car_qtd_item);
        }, 0);
        
        const notificacoes = usr_id ? await buscarNotificacoes(usr_id) : [];

        res.render('transacoes/usuario/pagamento', { 
            itensCarrinho: livrosComDetalhes,
            subtotalTotal,
            enderecos: enderecos,
            cartoes: cartoes,
            cupons: cupons,
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

        const notificacoes = await buscarNotificacoes(usr_id);
        
        res.render('transacoes/usuario/historico', {
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
        const errorMessage = req.query.error;

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

        res.render('transacoes/usuario/transacao', {
            transacao,
            usuario,
            endereco,
            formaPagamentos,
            itens,
            notificacoes,
            errorMessage
        });

    } catch (error) {
        console.error('Erro ao buscar detalhes da transação:', error);
        res.status(500).send('Erro ao carregar detalhes da transação');
    }
};

module.exports.getPedidos = async (req, res) => {
    try {

        const { tra_id, adm_id } = req.query;
        
        //Buscar dados do adm
        const adm = await buscarAdmId(adm_id);

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

        res.render('transacoes/adm/pedidos', {
            transacoes: transacoesComUsuarios
        });

    } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        res.status(500).send('Erro ao carregar pedidos');
    }
};

module.exports.getApiPedidosUsuario = async (req, res) => {
    const { usr_id } = req.params;

    const pedidos =  await getPedidosUsuario(usr_id);

    console.log(pedidos);

    return res.json(pedidos);
};

module.exports.getPedidoItem = async (req, res) => {
    try {
        const { tra_id, adm_id } = req.query;
        
        //Buscar dados do adm
        const adm = await buscarAdmId(adm_id);

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

        res.render('transacoes/adm/itemPedidoAdm', {
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

            const grupo = await buscarGrpPreco(livro.grupo_de_precificacao_grp_id);

            livro.valor = (((grupo.grp_margem_lucro * 0.01) + 1) * livro.lvr_custo) * (1 + livro.lvr_desconto);
            
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
            itensCarrinho: itensDetalhados
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
        const statusRequerEstoque = ['CANCELADO', 'REPROVADO', 'TROCA CONCLUIDA', 'DEVOLUCAO CONCLUIDA'];

        let result;

        if (statusRequerEstoque.includes(novoStatus)) {
           result = await atualizarStatusEReporEstoque(tra_id, novoStatus);
        } else {
           result = await atualizarTransacaoStatus(novoStatus, tra_id);
        }

        console.log(tra_id);
        console.log(novoStatus);

        if(novoStatus === ''){
            throw new Error('Alteração Cancelada');
        }

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

            await cancelarTransacaoAssociada(transacao.tra_id_original);
        }

        if (novoStatus === 'DEVOLUCAO CONCLUIDA') {
            await cancelarTransacaoAssociada(transacao.tra_id_original);
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
            case 'DEVOLUCAO CANCELADA':
                mensagem += 'DEVOLUÇÃO CANCELADA!';
                break;
            case 'DEVOLUCAO RECUSADA':
                mensagem += 'DEVOLUÇÃO RECUSADA!';
                break;
            case 'DEVOLUCAO APROVADA':
                mensagem += 'DEVOLUÇÃO APROVADA!';
                break;
            case 'DEVOLUCAO CONCLUIDA':
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
