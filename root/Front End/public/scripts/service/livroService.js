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
        console.error(`Erro no buscarLivrosVendidoService - serviceLivros: ${err}`);
        throw err;
    }
}

export async function getLivroPagina(livroId, usuarioId) {
    try {
        window.location.href = `/livros?lvr_id=${livroId}&usr_id=${usuarioId}`;
    } catch (error) {
        console.error(`Erro no getLivroPagina - serviceLivros: ${err}`);
        throw err;
    }
    
}

export async function estoqueService(entrada) {
    try {
        if (
            !entrada.est_quantidade || 
            !entrada.est_custo || 
            !entrada.est_fornecedor || 
            !entrada.livros_lvr_id
        ) {
            throw new Error("Todos os campos são obrigatórios!");
        }

        if (
            isNaN(entrada.est_quantidade) || 
            isNaN(entrada.est_custo) ||
            entrada.est_quantidade <= 0 ||
            entrada.est_custo <= 0
        ) {
            throw new Error("Quantidade e custo devem ser acima de zero!");
        }

        const res = await fetch('/estoque/entrada', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(entrada),
        });

        if (!res.ok) {
            throw new Error(`Erro na requisição: ${res.statusText}`);
        }

        return res.status;
    } catch (error) {
        console.error('Erro no estoqueService:', error);
        throw error;
    }
}