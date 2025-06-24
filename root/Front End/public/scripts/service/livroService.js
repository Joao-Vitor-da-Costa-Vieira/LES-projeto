export async function pesquisarLivroService(titulo, usr_id) {
    try {
        window.location.href = `/buscar-titulo?titulo=${encodeURIComponent(titulo)}&usr_id=${encodeURIComponent(usr_id || '')}`;
    } catch (err) {
        console.error(`Erro no pesquisarLivroService: ${err}`);
        throw err;
    }
}

export async function filtroLivroService(filtros) {
    try {

        const filtrosEncoded = encodeURIComponent(JSON.stringify(filtros));

        const response = await fetch(`/api/livros-filtro?filtros=${filtrosEncoded}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error('Erro na requisição');
        }

        return await response.json();
    } catch (err) {
        console.error(`Erro no filtroLivroService: ${err}`);
        throw err;
    }
}

export async function buscarLivrosVendidoService() {
    try{

        const res = await fetch(`/api/vendas/historico/`);
        const livros = await res.json();
        return livros;

    }catch(err){
        console.error(`Erro no buscarLivrosVendidoService - serviceHistoricoVendas: ${err}`);
        throw err;
    }
}