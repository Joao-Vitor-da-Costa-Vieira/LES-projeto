require('dotenv').config();

const express = require('express');
const session = require('express-session');
const routes = require('./backend/routes/index');
const path = require('path');

const app = express();

app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'front-end', 'views'));
app.use('/scripts', express.static(path.join(__dirname, 'front-end', 'scripts')));

app.use(session({
  secret: process.env.DB_SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use('/', routes);

app.use(express.urlencoded({ extended: true }));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});