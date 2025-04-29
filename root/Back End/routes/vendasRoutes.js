const express = require('express');
const router = express.Router();
const vendasController = require('../controllers/vendasController');

//Views
router.get('/pagamento',vendasController.getPagamento);
router.get('/pagamento/historico',vendasController.getHistorico);
router.get('/pedidos', vendasController.getPedidos);
router.get('/pedidos-adm/detalhes',vendasController.getPedidoItem);

router.post('/pagamento/confirmar',vendasController.postPagamento);

router.get('/api/pedidos/filtrar', vendasController.filtrarPedidos);
router.post('/api/pedidos-atualizar/status', vendasController.postAtualizarStatus);

module.exports = router;