const Usuario = require('../models/usuarioModel');

exports.cadastrarUsuario = (req, res) => {
    console.log('Dados recebidos no controller:', req.body);
    const usuario = req.body;
    Usuario.criar(usuario, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!', id: results.insertId });
    });
};


exports.recuperarUsuario = (req, res) => {
    const id = req.params.id;
    Usuario.recuperarPorId(id, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.status(200).json(results[0]);
    });
};

exports.atualizarUsuario = (req, res) => {
    const id = req.params.id;
    const usuario = req.body;
    Usuario.atualizar(id, usuario, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Usuário atualizado com sucesso!' });
    });
};