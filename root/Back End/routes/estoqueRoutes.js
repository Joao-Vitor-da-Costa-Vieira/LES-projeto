const express = require('express');
const router = express.Router()
const estoqueController = require('../controllers/estoqueController');

//Views
router.get('/estoque', estoqueController.getEstoque);

router.post('/estoque/entrada', estoqueController.postEstoque);

module.exports = router;