const express = require('express');
const router = express.Router();
const controllerCartao = require('../controller/controllerCartao');

// Views
router.get('/cartao/:usr_id', controllerCartao.getCartao);
router.get('/cartao/:usr_id/adicionar', controllerCartao.getCartaoAdd);
router.get('/cartao/:usr_id/atualizar/:crt_id', controllerCartao.getCartaoAlt);

router.put('/cartao/:usr_id/atualizar/:crt_id', controllerCartao.putCartaoAlt);

router.post('/cartao/:usr_id/adicionar', controllerCartao.postCartaoAdd);

module.exports = router;