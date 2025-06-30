const express = require('express');
const router = express.Router();
const UsuarioController = require('../../controllers/usuario/usuarioController');

//Views
router.get('/cadastro-primeiro', UsuarioController.getCadastroPrimeiro);
router.get('/cadastro', UsuarioController.getCadastro);
router.get('/atualizar', UsuarioController.getCadastroAtualizar);
router.get('/senha', UsuarioController.getSenha);
router.get('/inativos', UsuarioController.getUsuariosInativos);
router.get('/usuarios', UsuarioController.getUsuariosAtivos);
router.get('/cadastro-adm', UsuarioController.getCadastroAdm);
router.get('/atualizar-adm', UsuarioController.getCadastroAtualizarAdm);
router.get('/senha-adm', UsuarioController.getSenhaAdm);

router.get('/api/usuarios/id/:usr_id', UsuarioController.getApiUsuarioId);
router.get('/api/usuarios/ativos', UsuarioController.getApiUsuariosAtivos);
router.get('/api/usuarios/inativos', UsuarioController.getApiUsuariosInativos);
router.get('/api/usuarios-filtro', UsuarioController.getApiUsuarioFiltro);


router.post('/cadastro', UsuarioController.postCadastro);

router.put('/cadastro/:usr_id', UsuarioController.putCadastroAtualizar);
router.patch('/senha/:usr_id', UsuarioController.patchSenha);
router.patch('/usuarios/inativar/:usr_id', UsuarioController.patchInativarUsuario);
router.patch('/usuarios/ativar/:usr_id', UsuarioController.patchAtivarUsuario);



module.exports = router;