const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuarioController');

router.get('/cadastro', UsuarioController.getCadastro)
router.get('/cadastro/:usr_id', UsuarioController.getCadastroAtualizar);

router.post('/cadastro', UsuarioController.postCadastro);

router.put('/cadastro/:usr_id', UsuarioController.putCadastroAtualizar);


module.exports = router;