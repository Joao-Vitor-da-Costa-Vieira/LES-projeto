const express = require('express');
const router = express.Router()
const usuarioRoutes = require('./usuarioRoutes');
const enderecoCobrancaRoutes = require('./enderecoCobrancaRoutes');
const enderecoEntregaRoutes = require('./enderecoEntregaRoutes');
const cartaoRoutes = require('./cartaoRoutes');

router.use('/', usuarioRoutes);
router.use('/', enderecoCobrancaRoutes);
router.use('/', enderecoEntregaRoutes);
router.use('/', cartaoRoutes);

module.exports = router;