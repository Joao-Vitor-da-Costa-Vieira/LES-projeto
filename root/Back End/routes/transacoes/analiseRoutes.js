const express = require('express');
const router = express.Router();
const analiseController = require('../../controllers/transacoes/analiseController');

//Views
router.get('/analise', analiseController.getAnalise);

router.get('/api/vendas/historico', analiseController.getApiLivrosVendas);
router.get('/api/vendas/historico/datas', analiseController.getApiDatasVendas);

module.exports = router;