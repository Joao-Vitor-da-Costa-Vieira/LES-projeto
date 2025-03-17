const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuarioController');

//Views
router.get('cadastro', UsuarioController.getCadastro)
router.get(':usr_id', UsuarioController.getCadastroAtualizar);
router.get('/senha/:usr_id', UsuarioController.getSenha);
router.get('/inativos', UsuarioController.getInativos);
router.get('cadastro/:usr_id', UsuarioController.getUsuarios);

router.get('/api/usuarios/id/:usr_id', UsuarioController.getApiUsuarioId);
router.get('/api/usuarios/ativos', UsuarioController.getApiUsuariosAtivos);
router.get('/api/usuarios/inativos', UsuarioController.getApiUsuariosInativos);


router.post('/cadastro', UsuarioController.postCadastro);

router.put(':usr_id', UsuarioController.putCadastroAtualizar);
router.patch('/senha/:usr_id', UsuarioController.patchSenha);
router.patch('/usuarios/inativar/:usr_id', UsuarioController.patchInativarUsuario);
router.patch('/usuarios/ativar/:usr_id', UsuarioController.patchAtivarUsuario);



module.exports = router;