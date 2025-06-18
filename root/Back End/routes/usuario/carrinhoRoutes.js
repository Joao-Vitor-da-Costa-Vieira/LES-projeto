const express = require('express');
const router = express.Router();
const carrinhoController = require('../controllers/carrinhoController');

//Views
router.get('/carrinho', carrinhoController.getCarrinho);

router.post('/carrinho/adicionar', carrinhoController.adicionarCarrinho);
router.put('/carrinho/alterar',carrinhoController.alterarCarrinho);
router.delete('/carrinho/delete',carrinhoController.deletarCarrinho);

module.exports = router;