const {
    atualizarEnderecoCobranca,
    buscarEnderecoCobrancaId,
    buscarEnderecosCobrancaUsuarioId,
    cadastrarEnderecoCobranca
} = require("../../models/usuario/endCobrancaModel");

const { buscarNotificacoes } = require("../../models/usuario/notificacaoModel");

const { buscarUsuarioId } = require("../../models/usuario/usuarioModel");

// Views
module.exports.getEnderecoCobranca = async (req, res) => {
    const { usr_id } = req.query;

    const decodedUsrId = decodeURIComponent(usr_id)

    const enderecos = await buscarEnderecosCobrancaUsuarioId(decodedUsrId);
    const notificacoes = usr_id ? await buscarNotificacoes(decodedUsrId) : [];

    res.render('contas/usuario/endCobranca', { 
        enderecos: enderecos,
        notificacoes });
};

module.exports.getEnderecoCobrancaAdicionar = async (req, res) => {
    const { usr_id } = req.query;

    const decodedUsrId = decodeURIComponent(usr_id);

    const notificacoes = usr_id ? await buscarNotificacoes(decodedUsrId) : [];

    res.render('contas/usuario/endCobrancaAdicionar', { 
        notificacoes
     });
};

module.exports.getEnderecoCobrancaAtualizar = async (req, res) => {
    const {end_id, usr_id} = req.query;
    
    const decodedEndId = decodeURIComponent(end_id);
    const decodedUsrId = decodeURIComponent(usr_id);

    const enderecos = await buscarEnderecoCobrancaId(decodedEndId);
    const notificacoes = usr_id ? await buscarNotificacoes(decodedUsrId) : [];

    res.render('contas/usuario/endCobrancaAtualizar', { 
        enderecos: enderecos,
        notificacoes });
};

module.exports.getEnderecoCobrancaAdm = async (req, res) => {
    const { usr_id } = req.query;

    const decodedUsrId = decodeURIComponent(usr_id);

    const usuario = await buscarUsuarioId(decodedUsrId);
    const enderecos = await buscarEnderecosCobrancaUsuarioId(decodedUsrId);

    res.render('contas/adm/endCobrancaAdm', { 
        enderecos: enderecos,
        usuario: usuario
    });
};

module.exports.getEnderecoCobrancaAdicionarAdm = async (req, res) => {
    const { usr_id } = req.query;

    const decodedUsrId = decodeURIComponent(usr_id);

    const usuario = await buscarUsuarioId(decodedUsrId);

    res.render('contas/adm/endCobrancaAdicionarAdm', { 
        usuario: usuario
     });
};

module.exports.getEnderecoCobrancaAtualizarAdm = async (req, res) => {
    const {end_id, usr_id} = req.query;
    
    const decodedEndId = decodeURIComponent(end_id);
    const decodedUsrId = decodeURIComponent(usr_id);

    const usuario = await buscarUsuarioId(decodedUsrId);
    const enderecos = await buscarEnderecoCobrancaId(decodedEndId);

    res.render('contas/adm/endCobrancaAtualizarAdm', { 
        enderecos: enderecos,
        usuario: usuario });
};


// Inserção de dados
module.exports.postEnderecoCobrancaAdicionar = async (req, res) => {
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