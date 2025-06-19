const {
    atualizarCartao,
    buscarCartaoId,
    buscarCartoesUsuarioId,
    cadastrarCartao
} = require("../../models/usuario/cartaoModel");

// Views
module.exports.getCartao = async (req, res) => {
    const cartoes = await buscarCartoesUsuarioId(req.params.usr_id);
    res.render('contas/usuario/cartao', { cartoes: cartoes });
};

module.exports.getCartaoAdicionar = async (req, res) => {
    const cartoes = await buscarCartoesUsuarioId(req.params.usr_id);
    res.render('contas/usuario/cartaoAdicionar', { cartoes: cartoes });
};

module.exports.getCartaoAtualizar = async (req, res) => {
    const cartoes = await buscarCartaoId(req.params.crt_id);
    res.render('contas/usuario/cartaoAtualizar', { cartoes: cartoes });
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