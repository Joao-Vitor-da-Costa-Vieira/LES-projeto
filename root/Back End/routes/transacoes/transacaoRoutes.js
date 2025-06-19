const express = require('express');
const router = express.Router();
const vendasController = require('../../controllers/transacoes/vendasController');
const trocasController = require('../../controllers/transacoes/trocasController');
const devolucoesController = require('../../controllers/transacoes/devolucoesController');

//Views
router.get('/pagamento',vendasController.getPagamento);
router.get('/pagamento/historico',vendasController.getHistorico);
router.get('/pedidos', vendasController.getPedidos);
router.get('/pedidos-adm/detalhes',vendasController.getPedidoItem);
router.get('/pagamento/detalhes', vendasController.getTransacao);
router.get('/trocas',trocasController.getTroca);
router.get('/devolucoes',devolucoesController.getDevolucao);

router.post('/pagamento/confirmar',vendasController.postPagamento);
router.post('/trocas/confirmar',trocasController.postTroca);
router.post('/devolucoes/confirmar',devolucoesController.postDevolucao);

router.get('/api/pedidos/usuario/:usr_id', vendasController.getApiPedidosUsuario);
router.get('/api/pedidos/filtrar', vendasController.filtrarPedidos);
router.post('/api/pedidos-atualizar/status', vendasController.postAtualizarStatus);

module.exports = router;