const { buscarUsuarioId } = require("../models/usuario/usuarioModel");
const { buscarTransacoesPrioridade } = require("../models/transacoes/vendaModel");
const {buscarNotificacoes} = require("../models/usuario/notificacaoModel");

//Views
module.exports.getTela = (req, res) => {
    res.render('telaInicial');
};

module.exports.getHome = async (req, res) => {
    const usuario = await buscarUsuarioId(req.params.usr_id);
    const notificacoes = usuario ? await buscarNotificacoes(usuario.usr_id) : [];
    
    res.render('home', {
        usuario,
        notificacoes
    });
};

module.exports.getHomeAdm = async (req, res) => {
    try {

        const adm = req.query;
        
        // Buscar transações prioritárias
        const transacoes = await buscarTransacoesPrioridade();
        
        // Buscar informações dos usuários para cada transação
        const transacoesComUsuarios = await Promise.all(
            transacoes.map(async (transacao) => {
                const [usuario] = await buscarUsuarioId(transacao.usuarios_usr_id);
                return {
                    ...transacao,
                    usuario: usuario
                };
            })
        );

        res.render('homeAdm', {
            transacoes: transacoesComUsuarios
        });

    } catch (error) {
        console.error('Erro ao carregar página admin:', error);
        res.status(500).send('Erro ao carregar dados administrativos');
    }
};