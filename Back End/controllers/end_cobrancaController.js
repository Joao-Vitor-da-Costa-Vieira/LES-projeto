function cadastrarEnderecoCobranca(req, res) {
    const { cidade_c, bairro_c, estado_c, endereco_c, numero_c, complemento_c, cep_c } = req.body;

    req.session.enderecoCobranca = {
        cidade_c,
        bairro_c,
        estado_c,
        endereco_c,
        numero_c,
        complemento_c,
        cep_c
    };

    res.redirect('/cadastrar_end_entrega');
}

module.exports = {
    cadastrarEnderecoCobranca
};