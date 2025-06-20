const {
    criarDevolucao,
    verificarTransacaoAssociada,
} = require('../../models/transacoes/devolucoesModel');

const {
    buscarTransacaoPorId,
    buscarItensVendaPorTransacao,
} = require('../../models/transacoes/vendaModel');

const { 
    adicionarNotificacao,
    buscarNotificacoes 
} = require("../../models/usuario/notificacaoModel");

const { 
    buscarUsuarioId
} = require("../../models/usuario/usuarioModel");

const {
    buscarEnderecoEntregaPorTransacao
} = require("../../models/usuario/endEntregaModel");

module.exports.getDevolucao = async (req, res) => {
    try {
        const { tra_id } = req.query;
        
        console.log(tra_id);

        const result = await verificarTransacaoAssociada(tra_id);

        if (result === 1) {
            return res.redirect(`/pagamento/detalhes?tra_id=${tra_id}&error=Devolução já realizada para esta transação`);
        } else if (result === 2) {
            return res.redirect(`/pagamento/detalhes?tra_id=${tra_id}&error=Troca já realizada para esta transação`);
        }

        // Buscar transação original
        const transacaoOriginal = await buscarTransacaoPorId(tra_id);
        console.log(transacaoOriginal);

        // Buscar itens da transação original
        const itensOriginais = await buscarItensVendaPorTransacao(tra_id);  
        const endereco = await buscarEnderecoEntregaPorTransacao(tra_id);

        console.log(itensOriginais);
        console.log(endereco);

        // Preparar dados para a view
        const itensParaDevolucao = itensOriginais.map(item => ({
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

        res.render('transacoes/usuario/selecaoDevolucao', {
            itensVenda: itensParaDevolucao,
            subtotalTotal: 0,
            usuario,
            endereco,
            notificacoes,
            tra_id: tra_id
        });

    } catch (error) {
        console.error('Erro ao carregar devolucao:', error);
        res.status(500).send('Erro ao carregar página de devolucao');
    }
};


module.exports.postDevolucao = async (req, res) => {
    try {
        const { usr_id, tra_id, itens, subtotal, end_id } = req.body;
        console.log('tra id:',tra_id);

        const result = verificarTransacaoAssociada(tra_id);

        if(result === 1){
            throw new Error(
                    `Devolucao de compra já realizada.`
                );
        }
        
        // Validar estrutura dos dados
        if (!itens || !Array.isArray(itens)){
            throw new Error('Dados de itens inválidos');
        }

        const itensOriginais = await buscarItensVendaPorTransacao(tra_id);
        // Criar nova troca
        const novaTraId = await criarDevolucao(usr_id, {
            tra_id_original: tra_id,
            itens,
            subtotal,
            end_id
        }, 
        itensOriginais);

        // Adicionar notificação
        await adicionarNotificacao(
            usr_id,
            `Devolucao solicitada para o pedido #${tra_id}. Status: Devoulucao SOLICITADA`,
            novaTraId
        );

        res.status(200).json({
            success: true,
            tra_id: novaTraId,
            message: 'Devolucao solicitada com sucesso'
        });

    } catch (error) {
        console.error('Erro ao processar devolucao:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};