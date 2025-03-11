const EnderecoEntrega = require('../models/end_entregaModel');
const Usuario = require('../models/usuarioModel');

exports.cadastrarEnderecoEntrega = (req, res) => {
    console.log('Dados recebidos no controller:', req.body); // Verifique os dados recebidos
    const enderecoEntrega = req.body;

    // Recupera o ID do último usuário registrado
    Usuario.recuperarUltimoId((err, results) => {
        if (err) {
            console.error('Erro ao recuperar o último ID do usuário:', err);
            return res.status(500).json({ error: err.message });
        }

        const usuario_usr_id = results[0].ultimo_id; // ID do último usuário

        // Adiciona o ID do usuário ao objeto enderecoEntrega
        enderecoEntrega.usuario_usr_id = usuario_usr_id;

        console.log('Dados a serem enviados para o model:', enderecoEntrega); // Verifique os dados antes de chamar o model

        // Cadastra o endereço de entrega
        EnderecoEntrega.criar(enderecoEntrega, (err, results) => {
            if (err) {
                console.error('Erro no model:', err); // Log de erro
                return res.status(500).json({ error: err.message });
            }
            console.log('Resultados da inserção:', results); // Verifique os resultados da inserção
            res.status(201).json({ message: 'Endereço de entrega cadastrado com sucesso!', id: results.insertId });
        });
    });
};

exports.recuperarEnderecoEntrega = (req, res) => {
    const id = req.params.id;
    EnderecoEntrega.recuperarPorId(id, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Endereço de entrega não encontrado' });
        }
        res.status(200).json(results[0]);
    });
};

exports.atualizarEnderecoEntrega = (req, res) => {
    const id = req.params.id;
    const enderecoEntrega = req.body;
    EnderecoEntrega.atualizar(id, enderecoEntrega, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Endereço de entrega atualizado com sucesso!' });
    });
};