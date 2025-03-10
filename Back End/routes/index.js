const express = require('express');
const usuarioRoutes = require('./usuarioRoutes');
const enderecoCobrancaRoutes = require('./enderecoCobrancaRoutes'); 
const viewRoutes = require('./viewRoutes'); 

const router = express.Router();

router.use('/api', usuarioRoutes);
router.use('/api/enderecos/cobranca', enderecoCobrancaRoutes);

router.use('/', viewRoutes);

module.exports = router;