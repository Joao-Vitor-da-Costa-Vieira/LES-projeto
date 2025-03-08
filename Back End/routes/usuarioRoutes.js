const express = require('express');
const usuarioController = require('../controllers/usuarioController');

const router = express.Router();

router.post('/cadastrar', usuarioController.cadastrarUsuario);

module.exports = router;