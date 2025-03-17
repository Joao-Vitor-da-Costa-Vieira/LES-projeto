const express = require('express');
const router = express.Router();
const controllerEnderecoCobranca = require('../controller/endCobrancaController');

//Views
router.get('/endereco-cobranca/:usr_id', controllerEnderecoCobranca.getEnderecoCobranca);
router.get('/endereco-cobranca/:usr_id/adicionar', controllerEnderecoCobranca.getEnderecoCobrancaAdd);
router.get('/endereco-cobranca/:usr_id/atualizar/:end_id', controllerEnderecoCobranca.getEnderecoCobrancaAlt);

router.put('/endereco-cobranca/:usr_id/atualizar/:end_id', controllerEnderecoCobranca.putEnderecoCobrancaAlt);

router.post('/endereco-cobranca/:usr_id/adicionar', controllerEnderecoCobranca.postEnderecoCobrancaAdd);

router.get('/api/endereco-cobranca/:end_id', controllerEnderecoCobranca.getApiEnderecoCobrancaId);

module.exports = router;