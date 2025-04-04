const db = require('../config/db');

// Buscando os livros do banco de dados pelo titulo
async function buscarLivrosTitulo(titulo) {
    try {
        const [livros] = await db.query(
            'SELECT * FROM livros WHERE lvr_titulo LIKE ?', 
            [`%${titulo}%`]
        );
        return livros;
    } catch (err) {
        console.error('Erro ao buscar livros:', err);
        throw err; 
    }
}
async function consultaFiltroLivro(query, params){
    try {
        console.log('Executando query:', query);
        console.log('Com parâmetros:', params);
        
        const [livros] = await db.query(query, params);
        return livros;
    } catch (err) {
        console.error(`Erro no consultaFiltroLivro - modelLivros: ${err}`);
        throw err;
    }
}

module.exports = {
    buscarLivrosTitulo,
    consultaFiltroLivro
};