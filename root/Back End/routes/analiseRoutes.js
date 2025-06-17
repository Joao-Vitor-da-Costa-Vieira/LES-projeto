const express = require('express');
const router = express.Router();
const analiseController = require('../controllers/analiseController');

//Views
router.get('/analise', analiseController.getAnalise);

router.get('/api/vendas/historico', analiseController.getApiLivrosVendidos);
router.get('/api/vendas/historico/datas', analiseController.getApiDatasComVendas);

module.exports = router;