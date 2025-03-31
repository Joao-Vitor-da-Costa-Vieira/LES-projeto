const express = require('express');
const router = express.Router();
const telaInicialController = require('../controllers/telaInicialController');

router.get('/index', telaInicialController.getIndex);

module.exports = router;