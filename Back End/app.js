const express = require('express');
const cors = require('cors');
const usuarioRoutes = require('./routes/usuarioRoutes');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.use('/usuario', usuarioRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});