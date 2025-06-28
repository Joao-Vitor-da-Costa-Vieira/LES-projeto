const {
    atualizarEnderecoEntrega,
    buscarEnderecoEntregaId,
    buscarEnderecosEntregaUsuarioId,
    cadastrarEnderecoEntrega
} = require("../../models/usuario/endEntregaModel");

const { buscarNotificacoes } = require("../../models/usuario/notificacaoModel");

// Views
module.exports.getEnderecoEntrega = async (req, res) => {
    const { usr_id } = req.query;

    const decodedUsrId = decodeURIComponent(usr_id);

    const enderecos = await buscarEnderecosEntregaUsuarioId(decodedUsrId);
    const notificacoes = usr_id ? await buscarNotificacoes(decodedUsrId) : [];

    res.render('contas/usuario/endEntrega', { 
        enderecos: enderecos,
        notificacoes
     });
};

module.exports.getEnderecoEntregaAdicionar = async (req, res) => {
    const { usr_id } = req.query;

    const decodedUsrId = decodeURIComponent(usr_id);
    const notificacoes = usr_id ? await buscarNotificacoes(decodedUsrId) : [];

    res.render('contas/usuario/endEntregaAdicionar', { 
        notificacoes
     });
};

module.exports.getEnderecoEntregaAtualizar = async (req, res) => {
    const {end_id, usr_id} = req.query;

    const decodedEndId = decodeURIComponent(end_id);
    const decodedUsrId = decodeURIComponent(usr_id);   

    const enderecos = await buscarEnderecoEntregaId(decodedEndId);
    const notificacoes = usr_id ? await buscarNotificacoes(decodedUsrId) : [];

    res.render('contas/usuario/endEntregaAtualizar', { 
        enderecos: enderecos,
        notificacoes });
};

module.exports.getEnderecoEntregaAdm = async (req, res) => {
    const { usr_id } = req.query;

    const decodedUsrId = decodeURIComponent(usr_id);
    const enderecos = await buscarEnderecosEntregaUsuarioId(decodedUsrId);

    res.render('contas/adm/endEntrega', { 
        enderecos: enderecos,
        usr_id: decodedUsrId
     });
};

module.exports.getEnderecoEntregaAdicionarAdm = async (req, res) => {
    const { usr_id } = req.query;

    const decodedUsrId = decodeURIComponent(usr_id);

    res.render('contas/adm/endEntregaAdicionar', {
        usr_id: decodedUsrId
     });
};

module.exports.getEnderecoEntregaAtualizarAdm = async (req, res) => {
    const {end_id, usr_id} = req.query;

    const decodedEndId = decodeURIComponent(end_id);
    const decodedUsrId = decodeURIComponent(usr_id);   

    const enderecos = await buscarEnderecoEntregaId(decodedEndId);

    res.render('contas/adm/endEntregaAtualizar', { 
        enderecos: enderecos,
        usr_id: decodedUsrId
    });
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