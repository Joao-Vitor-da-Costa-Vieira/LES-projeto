const EnderecoCobranca = require('../models/end_cobrancaModel');
const Usuario = require('../models/usuarioModel'); // Importa o model Usuario

exports.cadastrarEnderecoCobranca = (req, res) => {
    console.log('Dados recebidos no controller:', req.body);
    const enderecoCobranca = req.body;

    Usuario.recuperarUltimoId((err, results) => {
        if (err) {
            console.error('Erro ao recuperar o último ID do usuário:', err);
            return res.status(500).json({ error: err.message });
        }

        const usuario_usr_id = results[0].ultimo_id; // ID do último usuário

        // Adiciona o ID do usuário ao objeto enderecoCobranca
        enderecoCobranca.usuario_usr_id = usuario_usr_id;
    
    // Validação dos campos obrigatórios
    if (!enderecoCobranca.end_estado || !enderecoCobranca.end_cidade || !enderecoCobranca.end_bairro || !enderecoCobranca.end_numero || !enderecoCobranca.end_cep || !enderecoCobranca.end_endereco || !enderecoCobranca.usuario_usr_id) {
        return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
    }

    EnderecoCobranca.criar(enderecoCobranca, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Endereço de cobrança cadastrado com sucesso!', id: results.insertId });
    });
});
};

exports.recuperarEnderecoCobranca = (req, res) => {
    const id = req.params.id;
    EnderecoCobranca.recuperarPorId(id, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Endereço de cobrança não encontrado' });
        }
        res.status(200).json(results[0]);
    });
};

exports.atualizarEnderecoCobranca = (req, res) => {
    const id = req.params.id;
    const enderecoCobranca = req.body;
    EnderecoCobranca.atualizar(id, enderecoCobranca, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Endereço de cobrança atualizado com sucesso!' });
    });
};