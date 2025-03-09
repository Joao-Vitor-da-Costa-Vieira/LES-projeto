const session = require('express-session');

module.exports = session({
  secret: 'suaChaveSecreta', // Chave secreta para assinar a sessão
  resave: false, // Evita regravar a sessão se não houver mudanças
  saveUninitialized: true, // Salva sessões não inicializadas
  cookie: { secure: false } // Defina como true se estiver usando HTTPS
});