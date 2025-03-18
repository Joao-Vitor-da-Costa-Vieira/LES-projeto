const express = require('express');
const router = express.Router();
const controllerEnderecoCobranca = require('../controllers/endCobrancaController');

//Views
router.get('/endereco-cobranca/:usr_id', controllerEnderecoCobranca.getEnderecoCobranca);
router.get('/endereco-cobranca/:usr_id/adicionar', controllerEnderecoCobranca.getEnderecoCobrancaAdicionar);
router.get('/endereco-cobranca/:usr_id/atualizar/:end_id', controllerEnderecoCobranca.getEnderecoCobrancaAtualizar);

router.put('/endereco-cobranca/:usr_id/atualizar/:end_id', controllerEnderecoCobranca.putEnderecoCobrancaAtualizar);

router.post('/endereco-cobranca/:usr_id/adicionar', controllerEnderecoCobranca.postEnderecoCobrancaAdicionar);

router.get('/api/endereco-cobranca/:end_id', controllerEnderecoCobranca.getApiEnderecoCobrancaId);

module.exports = router;