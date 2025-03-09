const EnderecoCobranca = require('../models/enderecoCobrancaModel');

exports.cadastrarEnderecoCobranca = async (req, res) => {
  const { usr_id, cidade, bairro, estado, endereco, numero, complemento, cep } = req.body;

  try {
    await EnderecoCobranca.cadastrar(usr_id, cidade, bairro, estado, endereco, numero, complemento, cep);
    res.status(201).json({ message: 'Endereço de cobrança cadastrado com sucesso!' });
  } catch (error) {
    console.error('Erro ao cadastrar endereço de cobrança:', error);
    res.status(500).json({ error: 'Erro ao cadastrar endereço de cobrança' });
  }
};