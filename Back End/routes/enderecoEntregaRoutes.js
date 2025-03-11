const express = require('express');
const router = express.Router();
const enderecoEntregaController = require('../controllers/end_entregaController');

// Cadastrar endereço de entrega
router.post('/enderecos-entrega', enderecoEntregaController.cadastrarEnderecoEntrega);

// Recuperar endereço de entrega por ID
router.get('/enderecos-entrega/:id', enderecoEntregaController.recuperarEnderecoEntrega);

// Atualizar endereço de entrega
router.put('/enderecos-entrega/:id', enderecoEntregaController.atualizarEnderecoEntrega);

module.exports = router;