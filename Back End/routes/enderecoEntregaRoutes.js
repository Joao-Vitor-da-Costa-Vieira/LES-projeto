const express = require('express');
const router = express.Router();
const controllerEnderecoEntrega = require('../controllers/endEntregaController');

// Views
router.get('/endereco-entrega/:usr_id', controllerEnderecoEntrega.getEnderecoEntrega);
router.get('/endereco-entrega/:usr_id/adicionar', controllerEnderecoEntrega.getEnderecoEntregaAdicionar);
router.get('/endereco-entrega/:usr_id/atualizar/:end_id', controllerEnderecoEntrega.getEnderecoEntregaAtualizar);

router.put('/endereco-entrega/:usr_id/atualizar/:end_id', controllerEnderecoEntrega.putEnderecoEntregaAtualizar);

router.post('/endereco-entrega/:usr_id/adicionar', controllerEnderecoEntrega.postEnderecoEntregaAdicionar);

router.get('/api/endereco-entrega/:end_id', controllerEnderecoEntrega.getApiEnderecoEntregaId);

module.exports = router;