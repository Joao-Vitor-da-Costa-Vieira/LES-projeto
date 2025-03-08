const express = require('express');
const connection = require('./db');
const usuarioRoutes = require('./routes/usuarioRoutes');

const app = express();
const PORT = 3000;

app.use('/usuario', usuarioRoutes);

app.get('/usuario', (req, res) => {
  connection.query('SELECT * FROM usuario', (err, results) => {
    if (err) {
      console.error('Erro ao executar a consulta:', err.stack);
      return res.status(500).send('Erro no servidor');
    }
    if (results.length === 0) {
        return res.status(404).send('Nenhum usuário encontrado');
    }
    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});