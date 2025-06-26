const { buscarUsuarioId, buscarUsuariosAtivos } = require("../models/usuario/usuarioModel");
const { buscarTransacoesPrioridade } = require("../models/transacoes/vendaModel");
const { buscarNotificacoes } = require("../models/usuario/notificacaoModel");
const { buscarTodosAdms, buscarAdmId } = require("../models/admModels");

//Views
module.exports.getTela = async (req, res) => {

    const usuarios = await buscarUsuariosAtivos();
    const adms = await buscarTodosAdms(); 

    res.render('telaInicial', {
        usuarios: usuarios,
        adms: adms
    });
};

module.exports.getHome = async (req, res) => {
    const { usr_id } = req.query;

    const usuario = await buscarUsuarioId(usr_id);
    const notificacoes = usuario ? await buscarNotificacoes(usr_id) : [];
    
    res.render('home', {
        usuario,
        notificacoes
    });
};

module.exports.getHomeAdm = async (req, res) => {
    try {

        const adm_id = req.query;

        const adm = await buscarAdmId(adm_id);

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
            adm: adm,
            transacoes: transacoesComUsuarios
        });

    } catch (error) {
        console.error('Erro ao carregar página admin:', error);
        res.status(500).send('Erro ao carregar dados administrativos');
    }
};