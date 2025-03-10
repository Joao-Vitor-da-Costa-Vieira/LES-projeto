const express = require('express');
const app = express();

const usuarioRoutes = require('./Back End/routes/usuarioRoutes');

app.use(express.json()); // Middleware para parsear JSON

// Usando as rotas
app.use('/api', usuarioRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});