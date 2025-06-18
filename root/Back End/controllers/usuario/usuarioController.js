const { cadastrarEnderecoEntrega, 
        buscarEnderecosEntregaUsuarioId, 
        atualizarEnderecoEntrega 
} = require("../models/endEntregaModel");

const { cadastrarEnderecoCobranca, 
        buscarEnderecosCobrancaUsuarioId, 
        atualizarEnderecoCobranca 
} = require("../models/endCobrancaModel");

const { cadastrarCartao, 
        buscarCartoesUsuarioId, 
        atualizarCartao 
}= require("../models/cartaoModel");

const { cadastrarUsuario, 
        buscarUsuarioId, 
        atualizarUsuario, 
        alterarSenhaUsuario, 
        buscarUsuariosAtivos, 
        buscarUsuariosInativos, 
        inativarUsuario,
        ativarUsuario 
} = require("../models/usuarioModel");

//Views
module.exports.getCadastro = (req, res) => {
    res.render('cadastrarUsuario');
};

module.exports.getCadastroAtualizar = async (req, res) => {
    const usuario = await buscarUsuarioId(req.params.usr_id);
    const enderecosCobranca = await buscarEnderecosCobrancaUsuarioId(req.params.usr_id);
    const enderecosEntrega = await buscarEnderecosEntregaUsuarioId(req.params.usr_id);
    const cartoes = await buscarCartoesUsuarioId(req.params.usr_id);

    res.render('atualizarUsuario', {
        usuario: usuario,
        enderecosCobranca: enderecosCobranca,
        enderecosEntrega: enderecosEntrega,
        cartoes: cartoes
    });
};

module.exports.getSenha = (req, res) => {
    res.render('senha');
};

module.exports.getUsuariosInativos = async (req, res) => {
    const inativos = await buscarUsuariosInativos();
    res.render('usuarioInativo', { inativos: inativos });
};

module.exports.getUsuariosAtivos = async (req, res) => {
    const usuarios = await buscarUsuariosAtivos();
    res.render('consultarUsuario', { usuarios: usuarios });
};

module.exports.patchSenha = async (req, res) => {
    try {
        await alterarSenhaUsuario(req.body, req.params.usr_id);
        res.sendStatus(204);
    } catch (err) {
        console.error(`Erro no patchSenha - controllerUsuario: ${err}`);
        res.sendStatus(500);
    }
};

module.exports.putCadastroAtualizar = async (req, res) => {
    try {
        await atualizarEnderecoCobranca(req.body.endereco_c, req.body.endereco_c.end_id);
        await atualizarEnderecoEntrega(req.body.endereco_e, req.body.endereco_e.end_id);
        await atualizarCartao(req.body.cartao, req.body.cartao.crt_id);
        await atualizarUsuario(req.body.usuario, req.params.usr_id);

        res.sendStatus(200);
    } catch (err) {
        console.error(`Erro no putCadastroAtualizar - controllerUsuario: ${err}`);
        res.sendStatus(500);
    }
};

module.exports.patchInativarUsuario = async (req, res) => {
    try {
        await inativarUsuario(req.params.usr_id);
        res.sendStatus(204);
    } catch (err) {
        console.error(`Erro no patchInativarUsuario - controllerUsuario: ${err}`);
        res.sendStatus(500);
    }
};

module.exports.patchAtivarUsuario = async (req, res) => {
    try {
        await ativarUsuario(req.params.usr_id);
        res.sendStatus(204);
    } catch (err) {
        console.error(`Erro no patchAtivarUsuario - controllerUsuario: ${err}`);
        res.sendStatus(500);
    }
};

// Inserindo dados no banco
module.exports.postCadastro = async (req, res) => {
    try {
        console.log("Dados recebidos no servidor:", req.body);
        const usr_id = await cadastrarUsuario(req.body.usuario);

        req.body.cartao.crt_usr_id = usr_id;
        req.body.endereco_c.end_usr_id = usr_id;
        req.body.endereco_e.end_usr_id = usr_id;

        await cadastrarCartao(req.body.cartao);
        await cadastrarEnderecoCobranca(req.body.endereco_c);
        await cadastrarEnderecoEntrega(req.body.endereco_e);

        res.sendStatus(200);
    } catch (err) {
        console.error(`Erro no postCadastro - controllerUsuario: ${err}`);
        res.sendStatus(500);
    }
};

module.exports.getApiUsuarioId = async (req, res) => {
    const usuario = await buscarUsuarioId(req.params.usr_id);
    res.json(usuario);
};

module.exports.getApiUsuariosAtivos = async (req, res) => {
    const usuarios = await buscarUsuariosAtivos();
    res.json(usuarios);
};

module.exports.getApiUsuariosInativos = async (req, res) => {
    const usuarios = await buscarUsuariosInativos();
    res.json(usuarios);
};