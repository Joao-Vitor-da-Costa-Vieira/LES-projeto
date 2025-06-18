const express = require('express');
const router = express.Router()
const notificacaoController = require('../../controllers/usuario/notificacaoController');

router.get('/notificacoes', notificacaoController.getNotificacoes);
router.delete('/notificacoes/:ntf_id', notificacaoController.deleteNotificacao);

module.exports = router;