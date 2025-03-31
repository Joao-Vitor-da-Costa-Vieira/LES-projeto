const express = require('express');
const router = express.Router();
const telaInicialController = require('../controllers/telaInicialController');

router.get('/telaInicial', telaInicialController.getTela);
router.get('/home/:usr_id',telaInicialController.getHome);

module.exports = router;