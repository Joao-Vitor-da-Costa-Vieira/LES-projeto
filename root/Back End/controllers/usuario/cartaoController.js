const {
    atualizarCartao,
    buscarCartaoId,
    buscarCartoesUsuarioId,
    cadastrarCartao
} = require("../../models/usuario/cartaoModel");

const {buscarUsuarioId} = require("../../models/usuario/usuarioModel");

const { buscarNotificacoes } = require("../../models/usuario/notificacaoModel");

// Views
module.exports.getCartao = async (req, res) => {
    const { usr_id } = req.query;

    const cartoes = await buscarCartoesUsuarioId(usr_id);
    const usuario = await buscarUsuarioId(usr_id);
    const notificacoes = usuario ? await buscarNotificacoes(usr_id) : [];

    res.render('contas/usuario/cartao', { 
        cartoes: cartoes,
        usuario: usuario,
        notificacoes });
};

module.exports.getCartaoAdicionar = async (req, res) => {
    const { usr_id } = req.query;

    const usuario = await buscarUsuarioId(usr_id);
    const notificacoes = usuario ? await buscarNotificacoes(usr_id) : [];

    res.render('contas/usuario/cartaoAdicionar', { 
        usuario: usuario,
        notificacoes
     });
};

module.exports.getCartaoAtualizar = async (req, res) => {

    const {crt_id, usr_id} = decodeURIComponent(req.query);

    const usuario = await buscarUsuarioId(usr_id);
    const cartoes = await buscarCartaoId(crt_id);
    const notificacoes = usuario ? await buscarNotificacoes(usr_id) : [];

    res.render('contas/usuario/cartaoAtualizar', { 
        cartoes: cartoes,
        usuario: usuario,
        notificacoes });
};

// Inserção de dados
module.exports.postCartaoAdicionar = async (req, res) => {
    try {
        await cadastrarCartao(req.body);
        res.sendStatus(200);
    } catch (err) {
        console.error(`Erro no postCartaoAdicionar - controllerCartao: ${err}`);
        res.sendStatus(500);
    }
};

// Atualizando os dados dos cartões
module.exports.putCartaoAtualizar = async (req, res) => {
    try {
        const cartao = await atualizarCartao(req.body, req.params.crt_id);
        res.json(cartao);
    } catch (err) {
        console.error(`Erro no putCartaoAtualizar - controllerCartao: ${err}`);
        res.sendStatus(500);
    }
};