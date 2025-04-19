const { buscarUsuarioId } = require("../models/usuarioModel");
const { buscarTransacoesPrioridade, formaPagamentoId } = require("../models/vendaModel");

//Views
module.exports.getTela = (req, res) => {
    res.render('telaInicial');
};

module.exports.getHome = async (req, res) => {
    const usuario = await buscarUsuarioId(req.params.usr_id);
    console.log("Usuário retornado:", usuario);

    res.render('home',{
        usuario
    });
};

module.exports.getHomeAdm = async (req, res) => {
    const transacoes = await buscarTransacoesPrioridade;
    console.log("Transações retornadas:", transacoes);

    res.render('homeAdm',{
        transacoes
    });
};