const Cartao = require('../models/cartaoModel');
const Usuario = require('../models/usuarioModel'); 

exports.cadastrarCartao = (req, res) => {
    console.log('Dados recebidos no controller:', req.body);
    const cartao = req.body;

    Usuario.recuperarUltimoId((err, results) => {
        if (err) {
            console.error('Erro ao recuperar o último ID do usuário:', err);
            return res.status(500).json({ error: err.message });
        }

        const usuario_usr_id = results[0].ultimo_id; // ID do último usuário

        cartao.usuario_usr_id = usuario_usr_id;
    
    // Validação dos campos obrigatórios
    if (!cartao.crt_numero || !cartao.crt_codigo_seguranca || !cartao.crt_bandeira || !cartao.crt_nome || !cartao.usuario_usr_id) {
        return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
    }

    Cartao.criar(cartao, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Cartao cadastrado com sucesso!', id: results.insertId });
    });
});
};

exports.recuperarCartao = (req, res) => {
    const id = req.params.id;
    Cartao.recuperarPorId(id, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: ' Cartao não encontrado' });
        }
        res.status(200).json(results[0]);
    });
};

exports.atualizarCartao = (req, res) => {
    const id = req.params.id;
    const cartao = req.body;
    Cartao.atualizar(id, cartao, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Cartao atualizado com sucesso!' });
    });
};