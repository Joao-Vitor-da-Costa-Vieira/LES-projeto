const express = require('express');
const router = express.Router();
const enderecoCobrancaController = require('../controllers/end_cobrancaController');

// Cadastrar endereço de cobrança
router.post('/enderecos-cobranca', enderecoCobrancaController.cadastrarEnderecoCobranca);

// Recuperar endereço de cobrança por ID
router.get('/enderecos-cobranca/:id', enderecoCobrancaController.recuperarEnderecoCobranca);

// Atualizar endereço de cobrança
router.put('/enderecos-cobranca/:id', enderecoCobrancaController.atualizarEnderecoCobranca);

module.exports = router;