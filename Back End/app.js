require('dotenv').config();

const express = require('express');
const session = require('express-session');
const routes = require('./routes');

const app = express();

app.use(session({
  secret: process.env.DB_SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(express.json());
app.use(routes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});