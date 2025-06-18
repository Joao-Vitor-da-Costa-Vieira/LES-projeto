const express = require('express');
const router = express.Router();
const vendasController = require('../../controllers/transacoes/vendasController');

//Views
router.get('/pagamento',vendasController.getPagamento);
router.get('/pagamento/historico',vendasController.getHistorico);
router.get('/pedidos', vendasController.getPedidos);
router.get('/pedidos-adm/detalhes',vendasController.getPedidoItem);
router.get('/pagamento/detalhes', vendasController.getTransacao);
router.get('/trocas',vendasController.getTroca);
router.get('/devolucoes',vendasController.getDevolucao);

router.post('/pagamento/confirmar',vendasController.postPagamento);
router.post('/trocas/confirmar',vendasController.postTroca);
router.post('/devolucoes/confirmar',vendasController.postDevolucao);

router.get('/api/pedidos/usuario/:usr_id', vendasController.getApiPedidosUsuario);
router.get('/api/pedidos/filtrar', vendasController.filtrarPedidos);
router.post('/api/pedidos-atualizar/status', vendasController.postAtualizarStatus);

module.exports = router;