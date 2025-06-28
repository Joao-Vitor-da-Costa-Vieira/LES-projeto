const express = require('express');
const router = express.Router();
const controllerCartao = require('../../controllers/usuario/cartaoController');

// Views
router.get('/cartao', controllerCartao.getCartao);
router.get('/cartao/adicionar', controllerCartao.getCartaoAdicionar);
router.get('/cartao/atualizar', controllerCartao.getCartaoAtualizar);
router.get('/cartao-adm', controllerCartao.getCartaoAdm);
router.get('/cartao-adm/adicionar', controllerCartao.getCartaoAdicionarAdm);
router.get('/cartao-adm/atualizar', controllerCartao.getCartaoAtualizarAdm);

router.put('/cartao/:usr_id/atualizar/:crt_id', controllerCartao.putCartaoAtualizar);

router.post('/cartao/:usr_id/adicionar', controllerCartao.postCartaoAdicionar);

module.exports = router;