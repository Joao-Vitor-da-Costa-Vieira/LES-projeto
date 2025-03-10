const express = require('express');
const session = require('express-session');
const routes = require('./routes');
const path = require('path');

require('dotenv').config();

const app = express();

app.use(session({
  secret: process.env.DB_SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(routes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});