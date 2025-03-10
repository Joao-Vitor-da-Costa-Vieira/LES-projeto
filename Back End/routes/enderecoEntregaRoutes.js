const express = require('express');
const enderecoCobrancaController = require('../controllers/enderecoEntregaController');

const router = express.Router();

router.post('/', enderecoEntregaController.cadastrarEnderecoEntrega);

module.exports = router;