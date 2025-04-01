const express = require('express');
const router = express.Router();
const telaInicialController = require('../controllers/telaInicialController');
const livroController = require('../controllers/livroController');

router.get('/telaInicial', telaInicialController.getTela);
router.get('/home/:usr_id',telaInicialController.getHome);
router.get('/buscarTitulo', livroController.pesquisarLivrosTitulo);

module.exports = router;