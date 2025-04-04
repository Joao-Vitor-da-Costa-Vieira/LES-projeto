const livroController = require('../controllers/livroController');

//Views
router.get('/buscarTitulo', livroController.pesquisarLivrosTitulo);

router.get('/api/livros-filtro',livroController.getApiFiltrarLivros);

module.exports = router;