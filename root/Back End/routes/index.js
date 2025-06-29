const express = require('express');
const router = express.Router()
const usuarioRoutes = require('./usuario/usuarioRoutes');
const enderecoCobrancaRoutes = require('./usuario/enderecoCobrancaRoutes');
const enderecoEntregaRoutes = require('./usuario/enderecoEntregaRoutes');
const cartaoRoutes = require('./usuario/cartaoRoutes');
const telaInicialRoutes = require('./telaInicialRoutes');
const livroRoutes = require('./livroRoutes');
const carrinhoRoutes = require('./transacoes/carrinhoRoutes');
const transacaoRoutes = require('./transacoes/transacaoRoutes');
const notificacaoRoutes = require('./usuario/notificacaoRoutes');
const analiseRoutes = require('./transacoes/analiseRoutes');
const estoqueRoutes = require('./estoqueRoutes');

router.use('/', telaInicialRoutes);
router.use('/', livroRoutes);
router.use('/', enderecoCobrancaRoutes);
router.use('/', enderecoEntregaRoutes);
router.use('/', cartaoRoutes);
router.use('/', usuarioRoutes);
router.use('/', carrinhoRoutes);
router.use('/', transacaoRoutes);
router.use('/', notificacaoRoutes);
router.use('/',analiseRoutes);
router.use('/',estoqueRoutes);


module.exports = router;