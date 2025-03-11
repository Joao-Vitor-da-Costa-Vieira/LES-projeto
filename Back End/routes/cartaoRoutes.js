const express = require('express');
const router = express.Router();
const cartaoController = require('../controllers/cartaoController');

router.post('/cartao', cartaoController.cadastrarCartao);

router.get('/cartao/:id', cartaoController.recuperarCartao);

router.put('/cartao/:id', cartaoController.atualizarCartao);

module.exports = router;