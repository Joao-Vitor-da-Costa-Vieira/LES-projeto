const express = require('express');
const router = express.Router();
const controllerCartao = require('../controllers/cartaoController');

// Views
router.get('/cartao/:usr_id', controllerCartao.getCartao);
router.get('/cartao/:usr_id/adicionar', controllerCartao.getCartaoAdicionar);
router.get('/cartao/:usr_id/atualizar/:crt_id', controllerCartao.getCartaoAtualizar);

router.put('/cartao/:usr_id/atualizar/:crt_id', controllerCartao.putCartaoAtualizar);

router.post('/cartao/:usr_id/adicionar', controllerCartao.postCartaoAdicionar);

module.exports = router;