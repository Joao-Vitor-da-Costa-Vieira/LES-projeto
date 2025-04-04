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

export async function filtroLivroService(filtros) {
    try {
        // Constrói a query string a partir do objeto de filtros
        const queryParams = new URLSearchParams();
        
        // Adiciona apenas os filtros que têm valores
        for (const key in filtros) {
            if (filtros[key] !== null && filtros[key] !== undefined && filtros[key] !== '') {
                queryParams.append(key, filtros[key]);
            }
        }

        const response = await fetch(`/api/livros-filtro?${queryParams.toString()}`, {
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