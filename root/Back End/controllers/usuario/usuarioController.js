const { cadastrarEnderecoEntrega, 
        buscarEnderecosEntregaUsuarioId
} = require("../../models/usuario/endEntregaModel");

const { cadastrarEnderecoCobranca, 
        buscarEnderecosCobrancaUsuarioId
} = require("../../models/usuario/endCobrancaModel");

const { cadastrarCartao, 
        buscarCartoesUsuarioId 
}= require("../../models/usuario/cartaoModel");

const { cadastrarUsuario, 
        buscarUsuarioId, 
        atualizarUsuario, 
        alterarSenhaUsuario, 
        buscarUsuariosAtivos, 
        buscarUsuariosInativos, 
        inativarUsuario,
        ativarUsuario,
        consultaFiltroUsuario 
} = require("../../models/usuario/usuarioModel");

const { buscarNotificacoes } = require("../../models/usuario/notificacaoModel");

const { buscarAdmId } = require("../../models/admModels"); 

//Views
module.exports.getCadastroPrimeiro = (req, res) => {
    res.render('contas/usuario/cadastrarUsuario');
};

module.exports.getCadastro = async (req, res) => {
    const { usr_id } = req.query;

    const notificacoes = usr_id ? await buscarNotificacoes(usr_id) : [];

    res.render('contas/usuario/cadastrarUsuario',{
        notificacoes
    });
};

module.exports.getCadastroAtualizar = async (req, res) => {
    const { usr_id } = req.query;

    const usuario = await buscarUsuarioId(usr_id);
    const enderecosCobranca = await buscarEnderecosCobrancaUsuarioId(usr_id);
    const enderecosEntrega = await buscarEnderecosEntregaUsuarioId(usr_id);
    const cartoes = await buscarCartoesUsuarioId(usr_id);

    const notificacoes = usr_id ? await buscarNotificacoes(usr_id) : [];

    res.render('contas/usuario/atualizarUsuario', {
        usuario: usuario,
        enderecosCobranca: enderecosCobranca,
        enderecosEntrega: enderecosEntrega,
        cartoes: cartoes,
        notificacoes
    });
};

module.exports.getSenha = async (req, res) => {
    const { usr_id } = req.query;

    const usuario = await buscarUsuarioId(usr_id);
    const notificacoes = usuario ? await buscarNotificacoes(usr_id) : [];

    res.render('contas/usuario/senha', {
        usuario: usuario,
        notificacoes
    });
};


module.exports.getCadastroAdm = async (req, res) => {

    res.render('contas/adm/cadastrarUsuarioAdm');
};

module.exports.getCadastroAtualizarAdm = async (req, res) => {
    const { usr_id } = req.query;

    const usuario = await buscarUsuarioId(usr_id);
    const enderecosCobranca = await buscarEnderecosCobrancaUsuarioId(usr_id);
    const enderecosEntrega = await buscarEnderecosEntregaUsuarioId(usr_id);
    const cartoes = await buscarCartoesUsuarioId(usr_id);

    res.render('contas/adm/atualizarUsuarioAdm', {
        usuario: usuario,
        enderecosCobranca: enderecosCobranca,
        enderecosEntrega: enderecosEntrega,
        cartoes: cartoes
    });
};

module.exports.getSenhaAdm = async (req, res) => {
    const { usr_id } = req.query;

    const usuario = await buscarUsuarioId(usr_id);

    res.render('contas/adm/senhaAdm', {
        usuario: usuario
    });
};

module.exports.getUsuariosInativos = async (req, res) => {

    try {

        const inativos = await buscarUsuariosInativos();

        res.render('contas/adm/usuarioInativo', { 
            inativos: inativos
        });
    } catch (error) {
        console.error(`Erro no getUsuariosInativos - controllerUsuario: ${err}`);
        res.sendStatus(500);
    }

};

module.exports.getUsuariosAtivos = async (req, res) => {

    const { adm_id } = req.query;

    const adm = await buscarAdmId(adm_id);

    const usuarios = await buscarUsuariosAtivos();
    res.render('contas/adm/consultarUsuario', { 
        usuarios: usuarios 
    });
};

module.exports.patchSenha = async (req, res) => {
    try {
        await alterarSenhaUsuario(req.body, req.params.usr_id);

        if (req.body.senha && req.body.senha.trim() === '') {
            throw new Error('Senha não pode ser vazia');
        }

        res.sendStatus(204);
    } catch (err) {
        console.error(`Erro no patchSenha - controllerUsuario: ${err}`);
        res.sendStatus(500);
    }
};

module.exports.putCadastroAtualizar = async (req, res) => {
    try {

        const usuario = req.body;
        const {usr_id} = req.params;

        //Validação dos dados
        const camposObrigatorios = [
            'usr_nome', 'usr_email', 'usr_cpf',
            'usr_data_de_nascimento', 'usr_telefone_1'
        ];

        for (const campo of camposObrigatorios) {
            if (!usuario[campo] || usuario[campo].trim() === '') {
                throw new Error(`Campo obrigatório faltando: ${campo}`);
            }
        }

        // Validação específica para senha se for fornecida
        if (usuario.usr_senha && usuario.usr_senha.trim() === '') {
            throw new Error('Senha não pode ser vazia');
        }

        await atualizarUsuario(usuario, usr_id);

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

       const camposObrigatorios = {
            usuario: [
                'usr_nome', 
                'usr_email', 
                'usr_cpf',
                'usr_data_de_nascimento',
                'usr_telefone1',
                'usr_senha'
            ],
            endereco_e: [
                'end_endereco',
                'end_numero',
                'end_bairro',
                'end_cidade',
                'end_estado',
                'end_cep'
            ],
            endereco_c: [
                'end_endereco',
                'end_numero',
                'end_bairro',
                'end_cidade',
                'end_estado',
                'end_cep'
            ],
            cartao: [
                'crt_nome',
                'crt_numero',
                'crt_bandeira',
                'crt_codigo_seguranca'
            ]
        };

        // Função de validação reutilizável
        const validarCampos = (objeto, campos) => {
            const faltantes = campos.filter(campo => 
                !objeto?.[campo] || objeto[campo].toString().trim() === ''
            );
            
            if (faltantes.length > 0) {
                throw new Error(
                    `Campos obrigatórios faltando em ${objeto.__section || 'objeto'}: ` +
                    faltantes.join(', ')
                );
            }
        };

        // Validar cada seção
        for (const [secao, campos] of Object.entries(camposObrigatorios)) {
            if (!req.body[secao]) {
                throw new Error(`Seção ${secao} não encontrada nos dados`);
            }
            
            // Marca a seção para mensagens de erro
            req.body[secao].__section = secao;
            validarCampos(req.body[secao], campos);
        }

        if(req.body.conf.senha !== req.body.usuario.usr_senha){
            throw new Error(`Senha e confirmação diferentes`);
        }
        
        const senha = req.body.usuario.usr_senha;
        const senhaValida = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(senha);
        
        if (!senhaValida) {
            throw new Error(
                'A senha deve conter pelo menos:\n' +
                '- 8 caracteres\n' +
                '- 1 letra maiúscula\n' +
                '- 1 letra minúscula\n' +
                '- 1 número\n' +
                '- 1 caractere especial'
            );
        }
        
        const usr_id = await cadastrarUsuario(req.body.usuario);

        req.body.cartao.crt_usr_id = usr_id;
        req.body.endereco_c.usuarios_usr_id = usr_id;
        req.body.endereco_e.usuarios_usr_id = usr_id;

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

module.exports.getApiUsuarioFiltro = async (req, res) => {
    try {
        // Obter todos os parâmetros de query da requisição
        const filtros = JSON.parse(decodeURIComponent(req.query.filtros));

        const usuarios = await consultaFiltroUsuario(filtros);
        
        res.json(usuarios);
    } catch (error) {
        console.error('Erro ao filtrar usuarios:', error);
        res.status(500).json({ error: 'Erro interno ao processar a filtragem de usuarios' });
    }
};

