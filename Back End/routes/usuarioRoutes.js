const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/UsuarioController');

// Cadastrar usuário
router.post('/usuarios', UsuarioController.cadastrarUsuario);

// Recuperar usuário por ID
router.get('/usuarios/:id', UsuarioController.recuperarUsuario);

// Atualizar usuário
router.put('/usuarios/:id', UsuarioController.atualizarUsuario);

module.exports = router;