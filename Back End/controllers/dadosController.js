const Usuario = require('../models/usuarioModel');
const EnderecoCobranca = require('../models/end_cobrancaModel');
const EnderecoEntrega = require('../models/end_entregaModel');
const Cartao = require('../models/cartaoModel');

exports.recuperarDadosUltimoUsuario = (req, res) => {
    Usuario.recuperarUltimoUsuario((err, usuarioResults) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (usuarioResults.length === 0) {
            return res.status(404).json({ message: 'Nenhum usuário encontrado.' });
        }

        const usuario = usuarioResults[0];
        const usuarioId = usuario.usr_id;

        // Recupera endereços de cobrança
        EnderecoCobranca.recuperarPorUsuarioId(usuarioId, (err, enderecosCobranca) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            // Recupera endereços de entrega
            EnderecoEntrega.recuperarPorUsuarioId(usuarioId, (err, enderecosEntrega) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                // Recupera cartões
                Cartao.recuperarPorUsuarioId(usuarioId, (err, cartoes) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }

                    // Retorna todos os dados
                    res.status(200).json({
                        usuario,
                        enderecosCobranca,
                        enderecosEntrega,
                        cartoes
                    });
                });
            });
        });
    });
};