const {
    atualizarEnderecoCobranca,
    buscarEnderecoCobrancaId,
    buscarEnderecosCobrancaUsuarioId,
    cadastrarEnderecoCobranca
} = require("../models/endCobrancaModel");

// Views
module.exports.getEnderecoCobranca = async (req, res) => {
    const enderecos = await buscarEnderecosCobrancaUsuarioId(req.params.usr_id);
    res.render('endereco-cobranca', { enderecos: enderecos });
};

module.exports.getEnderecoCobrancaAdicionar = async (req, res) => {
    const enderecos = await buscarEnderecosCobrancaUsuarioId(req.params.usr_id);
    res.render('endereco-cobranca-adicionar', { enderecos: enderecos });
};

module.exports.getEnderecoCobrancaAtualizar = async (req, res) => {
    const enderecos = await buscarEnderecoCobrancaId(req.params.end_id);
    res.render('endereco-cobranca-atualizar', { enderecos: enderecos });
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
module.exports.putEnderecoCobrancaAtuallizar = async (req, res) => {
    try {
        const endereco = await atualizarEnderecoCobranca(req.body, req.params.end_id);
        res.json(endereco);
    } catch (err) {
        console.error(`Erro no putEnderecoCobrancaAtualizar - controllerEnderecoCobranca: ${err}`);
        res.sendStatus(500);
    }
};