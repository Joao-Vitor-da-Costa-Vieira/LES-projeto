const {
    atualizarEnderecoCobranca,
    buscarEnderecoCobrancaId,
    buscarEnderecosCobrancaUsuarioId,
    cadastrarEnderecoCobranca
} = require("../../models/usuario/endCobrancaModel");

const {buscarUsuarioId} = require("../../models/usuario/usuarioModel");

const { buscarNotificacoes } = require("../../models/usuario/notificacaoModel");

// Views
module.exports.getEnderecoCobranca = async (req, res) => {
    const { usr_id } = req.query;

    const decodedUsrId = decodeURIComponent(usr_id)

    const enderecos = await buscarEnderecosCobrancaUsuarioId(decodedUsrId);
    const usuario = await buscarUsuarioId(decodedUsrId);
    const notificacoes = usuario ? await buscarNotificacoes(decodedUsrId) : [];

    res.render('contas/usuario/endCobranca', { 
        enderecos: enderecos,
        usuario: usuario,
        notificacoes });
};

module.exports.getEnderecoCobrancaAdicionar = async (req, res) => {
    const { usr_id } = req.query;

    const decodedUsrId = decodeURIComponent(usr_id);

    const usuario = await buscarUsuarioId(decodedUsrId);
    const notificacoes = usuario ? await buscarNotificacoes(decodedUsrId) : [];

    res.render('contas/usuario/endCobrancaAdicionar', { 
        usuario: usuario,
        notificacoes
     });
};

module.exports.getEnderecoCobrancaAtualizar = async (req, res) => {
    const {end_id, usr_id} = req.query;
    
    const decodedEndId = decodeURIComponent(end_id);
    const decodedUsrId = decodeURIComponent(usr_id);

    const usuario = await buscarUsuarioId(decodedUsrId);
    const enderecos = await buscarEnderecoCobrancaId(decodedEndId);
    const notificacoes = usuario ? await buscarNotificacoes(decodedUsrId) : [];

    res.render('contas/usuario/endCobrancaAtualizar', { 
        enderecos: enderecos,
        usuario: usuario,
        notificacoes });
};

// Inserção de dados
module.exports.postEnderecoCobrancaAdicionar = async (req, res) => {
    try {
        await cadastrarEnderecoCobranca(req.body);
        res.sendStatus(200);
    } catch (err) {
        console.error(`Erro no postEnderecoCobrancaAdicionar - controllerEnderecoCobranca: ${err}`);
        res.sendStatus(500);
    }
};

// Atualizando os dados dos endereços de cobrança
module.exports.putEnderecoCobrancaAtualizar = async (req, res) => {
    try {
        const endereco = await atualizarEnderecoCobranca(req.body, req.params.end_id);
        res.json(endereco);
    } catch (err) {
        console.error(`Erro no putEnderecoCobrancaAtualizar - controllerEnderecoCobranca: ${err}`);
        res.sendStatus(500);
    }
};

module.exports.getApiEnderecoCobrancaId = async(req, res) => {
    const endereco = await buscarEnderecoCobrancaId(req.params.end_id);
    res.json(endereco);
};