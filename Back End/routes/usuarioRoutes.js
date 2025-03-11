const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuarioController');

// Cadastrar usuário
router.post('/usuarios', UsuarioController.cadastrarUsuario);

// Recuperar usuário por ID
router.get('/usuarios/:id', UsuarioController.recuperarUsuario);

// Atualizar usuário
router.put('/usuarios/:id', UsuarioController.atualizarUsuario);

// Atualizar usuário parcialmente
router.patch('/usuarios/:id', UsuarioController.atualizarUsuarioParcial);

//Consulta Usuario
router.post('/usuarios/consultar', UsuarioController.consultarUsuarios);

// Rota para verificar endereços
router.get('/usuarios/:id/verificar-enderecos', UsuarioController.verificarEnderecos);

// Rota para atualizar status
router.put('/usuarios/:id/atualizar-status', UsuarioController.atualizarStatus);

module.exports = router;