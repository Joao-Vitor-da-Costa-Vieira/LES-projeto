const express = require('express');
const session = require('express-session');
const routes = require('./routes');

const app = express();

// Configuração da sessão
app.use(session({
  secret: 'suaChaveSecreta', // Chave secreta para assinar a sessão
  resave: false, // Evita regravar a sessão se não houver mudanças
  saveUninitialized: true, // Salva sessões não inicializadas
  cookie: { secure: false } // Defina como true se estiver usando HTTPS
}));

app.use(express.json());
app.use(routes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});