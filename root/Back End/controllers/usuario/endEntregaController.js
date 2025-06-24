const {
    atualizarEnderecoEntrega,
    buscarEnderecoEntregaId,
    buscarEnderecosEntregaUsuarioId,
    cadastrarEnderecoEntrega
} = require("../../models/usuario/endEntregaModel");

const {buscarUsuarioId} = require("../../models/usuario/usuarioModel");

const { buscarNotificacoes } = require("../../models/usuario/notificacaoModel");

// Views
module.exports.getEnderecoEntrega = async (req, res) => {
    const { usr_id } = req.query;

    const enderecos = await buscarEnderecosEntregaUsuarioId(usr_id);
    const usuario = await buscarUsuarioId(usr_id);
    const notificacoes = usuario ? await buscarNotificacoes(usr_id) : [];

    res.render('contas/usuario/endEntrega', { 
        enderecos: enderecos,
        usuario: usuario,
        notificacoes
     });
};

module.exports.getEnderecoEntregaAdicionar = async (req, res) => {
    const enderecos = await buscarEnderecosEntregaUsuarioId(req.params.usr_id);
    res.render('contas/usuario/endEntregaAdicionar', { enderecos: enderecos });
};

module.exports.getEnderecoEntregaAtualizar = async (req, res) => {
    const {end_id, usr_id} = decodeURIComponent(req.query);

    const usuario = await buscarUsuarioId(usr_id);
    const enderecos = await buscarEnderecoEntregaId(end_id);
    const notificacoes = usuario ? await buscarNotificacoes(usr_id) : [];

    res.render('contas/usuario/endEntregaAtualizar', { 
        enderecos: enderecos,
        usuario: usuario,
        notificacoes });
};

// Inserção de dados
module.exports.postEnderecoEntregaAdicionar = async (req, res) => {
    try {
        await cadastrarEnderecoEntrega(req.body, req.params.usr_id);
        res.sendStatus(200);
    } catch (err) {
        console.error(`Erro no postEnderecoEntregaAdicionar - controllerEnderecoEntrega: ${err}`);
        res.sendStatus(500);
    }
};

// Atualizando os dados dos endereços de entrega
module.exports.putEnderecoEntregaAtualizar = async (req, res) => {
    try {
        const endereco = await atualizarEnderecoEntrega(req.body, req.params.end_id);
        res.json(endereco);
    } catch (err) {
        console.error(`Erro no putEnderecoEntregaAtualizar - controllerEnderecoEntrega: ${err}`);
        res.sendStatus(500);
    }
};

module.exports.getApiEnderecoEntregaId = async(req, res) => {
    const endereco = await buscarEnderecoEntregaId(req.params.end_id);
    res.json(endereco);
};