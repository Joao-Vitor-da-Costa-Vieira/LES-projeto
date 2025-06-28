const {
    atualizarCartao,
    buscarCartaoId,
    buscarCartoesUsuarioId,
    cadastrarCartao
} = require("../../models/usuario/cartaoModel");

const { buscarNotificacoes } = require("../../models/usuario/notificacaoModel");

// Views
module.exports.getCartao = async (req, res) => {
    const { usr_id } = req.query;

    const cartoes = await buscarCartoesUsuarioId(usr_id);
    const notificacoes = usr_id ? await buscarNotificacoes(usr_id) : [];

    res.render('contas/usuario/cartao', { 
        cartoes: cartoes,
        notificacoes });
};

module.exports.getCartaoAdicionar = async (req, res) => {
    const { usr_id } = req.query;

    const decodedUsrId = decodeURIComponent(usr_id);

    const notificacoes = usr_id ? await buscarNotificacoes(decodedUsrId) : [];

    res.render('contas/usuario/cartaoAdicionar', { 
        notificacoes
     });
};

module.exports.getCartaoAtualizar = async (req, res) => {

    const {crt_id, usr_id} = req.query;

    const decodedCrtId = decodeURIComponent(crt_id);
    const decodedUsrId = decodeURIComponent(usr_id);

    const cartoes = await buscarCartaoId(decodedCrtId);
    const notificacoes = usr_id ? await buscarNotificacoes(decodedUsrId) : [];

    res.render('contas/usuario/cartaoAtualizar', { 
        cartoes: cartoes,
        notificacoes });
};

module.exports.getCartaoAdm = async (req, res) => {
    const { usr_id } = req.query;

    const cartoes = await buscarCartoesUsuarioId(usr_id);

    res.render('contas/adm/cartao', { 
        cartoes: cartoes,
        usr_id: decodedUsrId });
};

module.exports.getCartaoAdicionarAdm = async (req, res) => {
    const { usr_id } = req.query;

    const decodedUsrId = decodeURIComponent(usr_id);

    res.render('contas/adm/cartaoAdicionar', { 
        usr_id: decodedUsrId
     });
};

module.exports.getCartaoAtualizarAdm = async (req, res) => {

    const {crt_id, usr_id} = req.query;

    const decodedCrtId = decodeURIComponent(crt_id);
    const decodedUsrId = decodeURIComponent(usr_id);

    const cartoes = await buscarCartaoId(decodedCrtId);

    res.render('contas/adm/cartaoAtualizar', { 
        cartoes: cartoes,
        usr_id: decodedUsrId });
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