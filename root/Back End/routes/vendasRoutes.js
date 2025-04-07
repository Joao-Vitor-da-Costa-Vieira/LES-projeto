const express = require('express');
const router = express.Router();
const vendasController = require('../controllers/vendasController');

//Views
router.get('/pagamento',vendasController.getPagamento);

router.post('/pagamento/confirmar',vendasController.postPagamento);
router.get('/pagamento/cupom',vendasController.getCupom);

module.exports = router;