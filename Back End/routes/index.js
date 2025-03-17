const usuarioRoutes = require('./usuarioRoutes');
const enderecoCobrancaRoutes = require('./enderecoCobrancaRoutes');
const enderecoEntregaRoutes = require('./enderecoEntregaRoutes');
const cartaoRoutes = require('./cartaoRoutes');

app.use('/', usuarioRoutes);
app.use('/', enderecoCobrancaRoutes);
app.use('/', enderecoEntregaRoutes);
app.use('/', cartaoRoutes);

module.exports = router;