const {
    atualizarEnderecoEntrega,
    buscarEnderecoEntregaId,
    buscarEnderecosEntregaUsuarioId,
    cadastrarEnderecoEntrega
} = require("../models/endEntregaModel");

// Views
module.exports.getEnderecoEntrega = async (req, res) => {
    const enderecos = await buscarEnderecosEntregaUsuarioId(req.params.usr_id);
    res.render('endEntrega', { enderecos: enderecos });
};

module.exports.getEnderecoEntregaAdicionar = async (req, res) => {
    const enderecos = await buscarEnderecosEntregaUsuarioId(req.params.usr_id);
    res.render('endEntregaAdicionar', { enderecos: enderecos });
};

module.exports.getEnderecoEntregaAtualizar = async (req, res) => {
    const enderecos = await buscarEnderecoEntregaId(req.params.end_id);
    res.render('endEntregaAtualizar', { enderecos: enderecos });
};

// Inserção de dados
module.exports.postEnderecoEntregaAdicionar = async (req, res) => {
    try {
        await cadastrarEnderecoEntrega(req.body);
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