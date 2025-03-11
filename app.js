const express = require('express');
const app = express();
const cors = require('cors'); 

app.use(cors());

app.use(express.json()); 

const usuarioRoutes = require('./Back End/routes/usuarioRoutes');
app.use('/api', usuarioRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});