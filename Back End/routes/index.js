const express = require('express');
const usuarioRoutes = require('./usuarioRoutes');
const enderecoCobrancaRoutes = require('./enderecoCobrancaRoutes');
const enderecoEntregaRoutes = require('./enderecoEntregaRoutes');
const viewRoutes = require('./viewRoutes');

const router = express.Router();

// Rotas de usuário
router.use('/usuario', usuarioRoutes); // Rota base para usuário

// Rotas de endereço
router.use('/enderecos/cobranca', enderecoCobrancaRoutes); // Rota base para endereço de cobrança
router.use('/enderecos/entrega', enderecoEntregaRoutes); // Rota base para endereço de entrega

// Rotas de visualização (frontend)
router.use('/', viewRoutes);

module.exports = router;