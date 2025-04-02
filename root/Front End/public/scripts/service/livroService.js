export async function pesquisarLivroService(titulo, usr_id) {
    try {

        await fetch(`/buscarTitulo?titulo=${encodeURIComponent(titulo)}&usr_id=${encodeURIComponent(usr_id)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (err) {
        console.error(`Erro no pesquisarLivroService: ${err}`);
        throw err; 
    }
}