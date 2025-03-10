const EnderecoEntrega = require('../models/end_entregaModel');
const EnderecoCobranca = require('../models/end_cobrancaModel');
const Usuario = require('../models/usuarioModel');

async function cadastrarEnderecoEntrega(req, res) {
    try {
        // Recuperar dados da sessão
        const usuarioSession = req.session.usuario;
        const enderecoCobrancaSession = req.session.enderecoCobranca;

        if (!usuarioSession) {
            return res.status(400).json({ error: 'Dados do usuário não encontrados na sessão.' });
        }

        // Recuperar dados do formulário
        const { cidade_e, bairro_e, estado_e, endereco_e, numero_e, complemento_e, cep_e } = req.body;

        // Inserir usuário no banco de dados
        const usuarioInserido = await Usuario.cadastrar(
            usuarioSession.nome,
            usuarioSession.email,
            usuarioSession.cpf,
            usuarioSession.senha,
            usuarioSession.data_de_nascimento,
            usuarioSession.telefone_1,
            usuarioSession.telefone_2,
            usuarioSession.genero
        );

        // Inserir endereço de cobrança no banco de dados
        await EnderecoCobranca.cadastrar(
            usuarioInserido.usr_id,
            enderecoCobrancaSession.cidade_c,
            enderecoCobrancaSession.bairro_c,
            enderecoCobrancaSession.estado_c,
            enderecoCobrancaSession.endereco_c,
            enderecoCobrancaSession.numero_c,
            enderecoCobrancaSession.complemento_c,
            enderecoCobrancaSession.cep_c
        );

        // Inserir endereço de entrega no banco de dados
        await EnderecoEntrega.cadastrar(
            usuarioInserido.usr_id,
            cidade_e,
            bairro_e,
            estado_e,
            endereco_e,
            numero_e,
            complemento_e,
            cep_e
        );

        // Limpar dados da sessão
        delete req.session.usuario;
        delete req.session.enderecoCobranca;

        res.status(201).json({ message: 'Cadastro completo realizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao cadastrar endereço de entrega:', error);
        res.status(500).json({ error: 'Erro ao cadastrar endereço de entrega' });
    }
}

module.exports = {
    cadastrarEnderecoEntrega
};