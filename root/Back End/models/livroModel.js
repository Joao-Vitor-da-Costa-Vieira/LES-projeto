const db = require('../config/db');

// Buscando os livros do banco de dados pelo titulo
async function buscarLivrosTitulo(titulo) {
    try {
        const [livros] = await db.query('SELECT * FROM livros WHERE lvr_titulo LIKE ?',[`%${titulo}%`]);
        return livros;
    } catch (err) {
        console.error(`Erro no buscarLivrosTitulo - modelLivros: ${err}`);
        throw err;
    }
}

async function consultaFiltroLivro(){
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