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

exports.recuperarDadosUltimoUsuario = (req, res) => {
    Usuario.recuperarUltimoUsuario((err, usuarioResults) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (usuarioResults.length === 0) {
            return res.status(404).json({ message: 'Nenhum usuário encontrado.' });
        }

        const usuario = usuarioResults[0];

        usuario.usr_data_de_nascimento = new Date(usuario.usr_data_de_nascimento).toISOString().split('T')[0];

        res.status(200).json({ usuario });
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

// Novo método para atualização parcial
exports.atualizarUsuarioParcial = (req, res) => {
    const id = req.params.id;
    const dadosAtualizados = req.body;

    // Primeiro, recupera os dados atuais do usuário
    Usuario.recuperarPorId(id, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const usuarioAtual = results[0];

        // Combina os dados atuais com os novos dados fornecidos
        const usuarioCompleto = {
            usr_nome: dadosAtualizados.usr_nome || usuarioAtual.usr_nome,
            usr_email: dadosAtualizados.usr_email || usuarioAtual.usr_email,
            usr_cpf: dadosAtualizados.usr_cpf || usuarioAtual.usr_cpf,
            usr_senha: dadosAtualizados.usr_senha || usuarioAtual.usr_senha,
            usr_data_de_nascimento: dadosAtualizados.usr_data_de_nascimento || usuarioAtual.usr_data_de_nascimento,
            usr_telefone_1: dadosAtualizados.usr_telefone_1 || usuarioAtual.usr_telefone_1,
            usr_telefone_2: dadosAtualizados.usr_telefone_2 || usuarioAtual.usr_telefone_2,
            usr_genero: dadosAtualizados.usr_genero || usuarioAtual.usr_genero
        };

        // Atualiza o usuário no banco de dados
        Usuario.atualizar(id, usuarioCompleto, (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({ message: 'Usuário atualizado com sucesso!' });
        });
    });
};