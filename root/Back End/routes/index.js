const express = require('express');
const router = express.Router()
const usuarioRoutes = require('./usuarioRoutes');
const enderecoCobrancaRoutes = require('./enderecoCobrancaRoutes');
const enderecoEntregaRoutes = require('./enderecoEntregaRoutes');
const cartaoRoutes = require('./cartaoRoutes');
const telaInicialRoutes = require('./telaInicialRoutes');
const livroRoutes = require('./livroRoutes');
const carrinhoRoutes = require('./carrinhoRoutes');
const transacaoRoutes = require('./transacaoRoutes');
const notificacaoRoutes = require('./notificacaoRoutes');

router.use('/', telaInicialRoutes);
router.use('/', livroRoutes);
router.use('/', enderecoCobrancaRoutes);
router.use('/', enderecoEntregaRoutes);
router.use('/', cartaoRoutes);
router.use('/', usuarioRoutes);
router.use('/', carrinhoRoutes);
router.use('/', transacaoRoutes);
router.use('/', notificacaoRoutes);


module.exports = router;