const express = require('express');
const router = express.Router();
const dadosController = require('../controllers/dadosController');

router.get('/usuario/dados', dadosController.recuperarDadosUltimoUsuario);

module.exports = router;