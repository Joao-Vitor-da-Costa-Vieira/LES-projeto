const express = require('express');
const enderecoCobrancaController = require('../controllers/enderecoCobrancaController');

const router = express.Router();

router.post('/', enderecoCobrancaController.cadastrarEnderecoCobranca);

module.exports = router;