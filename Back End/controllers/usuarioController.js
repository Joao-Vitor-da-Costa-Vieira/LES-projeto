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

// Função para consultar usuários
exports.consultarUsuarios = (req, res) => {
    const { coluna, valor } = req.body;

    // Verifica se a coluna e o valor foram fornecidos
    if (!coluna || !valor) {
        return res.status(400).json({ success: false, message: "Coluna e valor são obrigatórios." });
    }

    // Consulta os usuários no banco de dados
    Usuario.consultar(coluna, valor, (err, resultados) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Erro ao consultar usuários." });
        }

        if (resultados.length === 0) {
            return res.status(404).json({ success: false, message: "Nenhum usuário encontrado." });
        }

        // Retorna os resultados
        res.status(200).json({ success: true, resultados });
    });
};

// Função para verificar endereços de cobrança e entrega
exports.verificarEnderecos = (req, res) => {
    const usuarioId = req.params.id;

    Usuario.verificarEnderecos(usuarioId, (err, resultados) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Erro ao verificar endereços." });
        }

        const possuiEnderecos = resultados[0].endereco_cobranca > 0 && resultados[0].endereco_entrega > 0;
        res.status(200).json({ success: true, possuiEnderecos });
    });
};

// Função para atualizar o status de atividade do usuário
exports.atualizarStatus = (req, res) => {
    const usuarioId = req.params.id;
    const novoStatus = req.body.novoStatus;

    // Verifica se o novo status é 1 (Ativo)
    if (novoStatus === 1) {
        // Verifica se o usuário possui endereços de cobrança e entrega
        Usuario.verificarEnderecos(usuarioId, (err, resultados) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Erro ao verificar endereços." });
            }

            const possuiEnderecos = resultados[0].endereco_cobranca > 0 && resultados[0].endereco_entrega > 0;

            if (!possuiEnderecos) {
                return res.status(400).json({ success: false, message: "O usuário precisa ter pelo menos um endereço de cobrança e um de entrega para ativar o status." });
            }

            // Atualiza o status
            Usuario.atualizarStatus(usuarioId, novoStatus, (err, results) => {
                if (err) {
                    return res.status(500).json({ success: false, message: "Erro ao atualizar status." });
                }
                res.status(200).json({ success: true, message: "Status atualizado com sucesso." });
            });
        });
    } else {
        // Se o novo status for 0 (Inativo), atualiza diretamente
        Usuario.atualizarStatus(usuarioId, novoStatus, (err, results) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Erro ao atualizar status." });
            }
            res.status(200).json({ success: true, message: "Status atualizado com sucesso." });
        });
    }
};

exports.recuperarEnderecos = (req, res) => {
    const usuarioId = req.params.id;

    // Consulta os endereços de cobrança e entrega
    const query = `
        SELECT 'Cobrança' AS tipo, end_endereco, end_cep, end_cidade, end_estado FROM endereco_cobranca WHERE usuario_usr_id = ?
        UNION ALL
        SELECT 'Entrega' AS tipo, end_endereco, end_cep, end_cidade, end_estado FROM endereco_entrega WHERE usuario_usr_id = ?
    `;
    db.query(query, [usuarioId, usuarioId], (err, resultados) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Erro ao recuperar endereços." });
        }
        res.status(200).json({ success: true, enderecos: resultados });
    });
};