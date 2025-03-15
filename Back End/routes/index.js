const usuarioRoutes = require('./usuarioRoutes');
const enderecoCobrancaRoutes = require('./enderecoCobrancaRoutes');
const enderecoEntregaRoutes = require('./enderecoEntregaRoutes');
const cartaoRoutes = require('./cartaoRoutes');
const dadosRoutes = require('./dadosRoutes');

app.use('/api', usuarioRoutes);
app.use('/api', enderecoCobrancaRoutes);
app.use('/api', enderecoEntregaRoutes);
app.use('/api', cartaoRoutes);
app.use('/api', dadosRoutes);

module.exports = router;