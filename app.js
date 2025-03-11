const express = require('express');
const app = express();
const cors = require('cors'); 

app.use(cors());

app.use(express.json()); 

const usuarioRoutes = require('./Back End/routes/usuarioRoutes');
const enderecoCobrancaRoutes = require('./Back End/routes/enderecoCobrancaRoutes');
const enderecoEntregaRoutes = require('./Back End/routes/enderecoEntregaRoutes');
const cartaoRoutes = require('./Back End/routes/cartaoRoutes');

app.use('/api', usuarioRoutes);
app.use('/api', enderecoCobrancaRoutes);
app.use('/api', enderecoEntregaRoutes);
app.use('/api', cartaoRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});