const express = require('express');
const path = require('path');
const routes = require('./Back End/routes');

const app = express();

app.use(express.static('./Front End/public'));

app.use(express.json()); 

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname + '/Front End/views'));

app.use(routes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});