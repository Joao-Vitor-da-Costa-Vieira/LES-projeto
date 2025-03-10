const express = require('express');
const enderecoEntregaController = require('../controllers/end_entregaController');

const router = express.Router();

router.post('/', enderecoEntregaController.cadastrarEnderecoEntrega);

module.exports = router;