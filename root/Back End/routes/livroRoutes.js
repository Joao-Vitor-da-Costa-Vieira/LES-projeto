const express = require('express');
const router = express.Router()
const livroController = require('../controllers/livroController');

//Views
router.get('/buscar-titulo', livroController.pesquisarLivrosTitulo);
router.get('/livros', livroController.livroPagina);

router.get('/api/livros-filtro',livroController.getApiFiltrarLivros);
router.get('/api/todos-livros',livroController.getApiTodosLivros);

module.exports = router;