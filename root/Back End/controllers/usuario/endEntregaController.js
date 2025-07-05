const {
    atualizarEnderecoEntrega,
    buscarEnderecoEntregaId,
    buscarEnderecosEntregaUsuarioId,
    cadastrarEnderecoEntrega
} = require("../../models/usuario/endEntregaModel");

const { buscarNotificacoes } = require("../../models/usuario/notificacaoModel");
const { buscarUsuarioId } = require("../../models/usuario/usuarioModel");

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

    const usuario = await buscarUsuarioId(decodedUsrId);
    const enderecos = await buscarEnderecosEntregaUsuarioId(decodedUsrId);

    res.render('contas/adm/endEntregaAdm', { 
        enderecos: enderecos,
        usuario: usuario
     });
};

module.exports.getEnderecoEntregaAdicionarAdm = async (req, res) => {
    const { usr_id } = req.query;

    const decodedUsrId = decodeURIComponent(usr_id);
    const usuario = await buscarUsuarioId(decodedUsrId);

    res.render('contas/adm/endEntregaAdicionarAdm', {
        usuario: usuario
     });
};

module.exports.getEnderecoEntregaAtualizarAdm = async (req, res) => {
    const {end_id, usr_id} = req.query;

    const decodedEndId = decodeURIComponent(end_id);
    const decodedUsrId = decodeURIComponent(usr_id);  
    
    const usuario = await buscarUsuarioId(decodedUsrId);
    const enderecos = await buscarEnderecoEntregaId(decodedEndId);

    res.render('contas/adm/endEntregaAtualizarAdm', { 
        enderecos: enderecos,
        usuario: usuario
    });
};

// Inserção de dados
module.exports.postEnderecoEntregaAdicionar = async (req, res) => {
    try {

        //Validação dos dados
        const camposObrigatorios = [
            'end_bairro', 'end_cep', 'end_cidade', 
            'end_estado', 'end_endereco', 'end_numero'
        ];
        
        for (const campo of camposObrigatorios) {
            if (!req.body[campo] || req.body[campo].trim() === '') {
                return res.status(400).json({ 
                    error: `Campo obrigatório faltando: ${campo}` 
                });
            }
        }

        await cadastrarEnderecoEntrega(req.body);
        res.sendStatus(200);
    } catch (err) {
        console.error(`Erro no postEnderecoEntregaAdicionar - controllerEnderecoEntrega: ${err}`);
        res.sendStatus(500);
    }
};

module.exports.putEnderecoEntregaAtualizar = async (req, res) => {
    try {

        //Validação dos Dados
        const camposObrigatorios = [
            'end_bairro', 'end_cep', 'end_cidade', 
            'end_estado', 'end_endereco', 'end_numero'
        ];
        
        for (const campo of camposObrigatorios) {
            if (!req.body[campo] || req.body[campo].trim() === '') {
                return res.status(400).json({ 
                    error: `Campo obrigatório faltando: ${campo}` 
                });
            }
        }

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