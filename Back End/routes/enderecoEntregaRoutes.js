const express = require('express');
const router = express.Router();
const controllerEnderecoEntrega = require('../controller/endEntregaController');

// Views
router.get('/endereco-entrega/:usr_id', controllerEnderecoEntrega.getEnderecoEntrega);
router.get('/endereco-entrega/:usr_id/adicionar', controllerEnderecoEntrega.getEnderecoEntregaAdd);
router.get('/endereco-entrega/:usr_id/atualizar/:end_id', controllerEnderecoEntrega.getEnderecoEntregaAlt);

router.put('/endereco-entrega/:usr_id/atualizar/:end_id', controllerEnderecoEntrega.putEnderecoEntregaAlt);

router.post('/endereco-entrega/:usr_id/adicionar', controllerEnderecoEntrega.postEnderecoEntregaAdd);

router.get('/api/endereco-entrega/:end_id', controllerEnderecoEntrega.getApiEnderecoEntregaId);

module.exports = router;