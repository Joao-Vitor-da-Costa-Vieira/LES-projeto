const {buscarNotificacoes,
    apagarNotificacao
} = require("../../models/usuario/notificacaoModel");

module.exports.getNotificacoes = async (req, res) => {
    try {
        const { usr_id } = req.query;
        const notificacoes = await buscarNotificacoes(usr_id);
        res.json(notificacoes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports.deleteNotificacao = async (req, res) => {
    try {
        const { ntf_id } = req.params;
        const result = await apagarNotificacao(ntf_id);
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};