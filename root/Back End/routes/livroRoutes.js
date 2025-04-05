const express = require('express');
const router = express.Router()
const livroController = require('../controllers/livroController');

//Views
router.get('/buscar-titulo', livroController.pesquisarLivrosTitulo);
router.get('/livro/:lvr_id', livroController.livroPagina);

router.get('/api/livros-filtro',livroController.getApiFiltrarLivros);

module.exports = router;