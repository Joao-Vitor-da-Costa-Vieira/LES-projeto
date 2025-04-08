const express = require('express');
const router = express.Router();
const vendasController = require('../controllers/vendasController');

//Views
router.get('/pagamento',vendasController.getPagamento);
router.get('/pagamento/historico',vendasController.getHistorico);

router.post('/pagamento/confirmar',vendasController.postPagamento);

module.exports = router;