const express = require('express');
const router = express.Router();
const telaInicialController = require('../controllers/telaInicialController');

router.get('/telaInicial', telaInicialController.getTela);

module.exports = router;