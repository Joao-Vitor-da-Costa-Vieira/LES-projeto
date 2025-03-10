const express = require('express');
const usuarioRoutes = require('./usuarioRoutes');
const enderecoCobrancaRoutes = require('./enderecoCobrancaRoutes'); 
const enderecoEntregaRoutes = require('./enderecoEntregaRoutes'); 
const viewRoutes = require('./viewRoutes'); 

const router = express.Router();

router.use('/api', usuarioRoutes);
router.use('/api/enderecos/cobranca', enderecoCobrancaRoutes);
router.use('/api/enderecos/entrega', enderecoEntregaRoutes);

router.use('/', viewRoutes);

module.exports = router;