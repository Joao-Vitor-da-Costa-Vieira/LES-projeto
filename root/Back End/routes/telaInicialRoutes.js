const express = require('express');
const router = express.Router();
const telaInicialController = require('../controllers/telaInicialController');

router.get('/telaInicial', telaInicialController.getTela);
router.get('/home',telaInicialController.getHome);
router.get('/home-adm',telaInicialController.getHomeAdm);

module.exports = router;