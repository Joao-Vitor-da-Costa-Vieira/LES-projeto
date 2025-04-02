const livroController = require('../controllers/livroController');

//Views
router.get('/buscarTitulo', livroController.pesquisarLivrosTitulo);

module.exports = router;