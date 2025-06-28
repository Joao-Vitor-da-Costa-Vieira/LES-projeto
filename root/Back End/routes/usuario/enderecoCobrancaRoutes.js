const express = require('express');
const router = express.Router();
const controllerEnderecoCobranca = require('../../controllers/usuario/endCobrancaController');

//Views
router.get('/endereco-cobranca', controllerEnderecoCobranca.getEnderecoCobranca);
router.get('/endereco-cobranca/adicionar', controllerEnderecoCobranca.getEnderecoCobrancaAdicionar);
router.get('/endereco-cobranca/atualizar', controllerEnderecoCobranca.getEnderecoCobrancaAtualizar);
router.get('/endereco-cobranca-adm', controllerEnderecoCobranca.getEnderecoCobrancaAdm);
router.get('/endereco-cobranca-adm/adicionar', controllerEnderecoCobranca.getEnderecoCobrancaAdicionarAdm);
router.get('/endereco-cobranca-adm/atualizar', controllerEnderecoCobranca.getEnderecoCobrancaAtualizarAdm);

router.put('/endereco-cobranca/:usr_id/atualizar/:end_id', controllerEnderecoCobranca.putEnderecoCobrancaAtualizar);

router.post('/endereco-cobranca/:usr_id/adicionar', controllerEnderecoCobranca.postEnderecoCobrancaAdicionar);

router.get('/api/endereco-cobranca/:end_id', controllerEnderecoCobranca.getApiEnderecoCobrancaId);

module.exports = router;