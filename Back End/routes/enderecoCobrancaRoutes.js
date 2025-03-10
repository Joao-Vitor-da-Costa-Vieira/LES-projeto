const express = require('express');
const enderecoCobrancaController = require('../controllers/end_cobrancaController');

const router = express.Router();

router.post('/', enderecoCobrancaController.cadastrarEnderecoCobranca);

module.exports = router;