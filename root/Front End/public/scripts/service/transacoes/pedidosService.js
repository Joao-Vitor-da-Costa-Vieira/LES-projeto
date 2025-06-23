export const atualizarStatus = async (tra_id, novoStatus) => {
    try {
        const response = await fetch(`/api/pedidos-atualizar/status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({tra_id, novoStatus })
        });
        return await response.json();
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        return { success: false, error: 'Erro na comunicação com o servidor' };
    }
};

export async function buscarDatasVendaService() {
    try{

        const res = await fetch(`/api/vendas/historico/datas`);
        const datas = await res.json();
        return datas;

    }catch(err){
        console.error(`Erro no buscarDatasVendasService - serviceHistoricoVendas: ${err}`);
        throw err;
    }
}

export async function buscarHistorico(usuarioId){
    try{
        window.location.href = `/pagamento/historico?usr_id=${usuarioId}`;
    }catch(err){
        console.error(`Erro no buscarHistorico - servicePedidos: ${err}`);
        throw err;
    }
}

export async function buscarTransacao(id) {
    try{
        window.location.href = `/pagamento/detalhes?tra_id=${id}`;
    }catch(err){
        console.error(`Erro no buscarTransacao - servicePedidos: ${err}`);
        throw err;
    }
    
}

export async function confirmarPagamento(usr_id, enderecoId, dataAtual, subtotal, frete, total, pagamentos) {
    try {
        const response = await fetch('/pagamento/confirmar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    usuarioId: parseInt(usr_id),
                    enderecoId: parseInt(enderecoId),
                    data: dataAtual,
                    subtotal: subtotal,
                    frete: frete,
                    total: total,
                    pagamentos: pagamentos
                })
            });
        
        return response;

    } catch (error) {
        console.error(`Erro no confirmarPagamento - servicePedidos: ${err}`);
        throw err;
    }
}

export async function filterPedido(filtros) {
    try {
        const queryParams = new URLSearchParams();
            
        Object.entries(filtros).forEach(([key, value]) => {
            if (value !== '' && value !== null && value !== undefined) {
                queryParams.append(key, value);
            }
        });

        const response = await fetch(`/api/pedidos/filtrar?${queryParams.toString()}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) throw new Error('Erro na requisição');
        return await response.json();
    } catch (err) {
        console.error(`Erro no filterPedido - servicePedidos:, ${err}`);
        throw err;
    }
}

export async function buscarPedidos() {
    try {
        window.location.href = '/pedidos';
    } catch (error) {
        console.error(`Erro no buscarPedidos - servicePedidos:, ${err}`);
        throw err;
    }
}

export async function buscarPedido(id) {
    try {
        window.location.href = `/pedidos-adm/detalhes?tra_id=${id}`;
    } catch (error) {
        console.error(`Erro no buscarPedidos - servicePedidos:, ${err}`);
        throw err;
    }
}

export async function atualizarUrlFiltros(filtros){

    //Url base
    let url = '/api/vendas/historico?';
    const params = []

    //Adicionando os filtros por data
    if(filtros.inicio){
        params.push(`inicio=${encodeURIComponent(filtros.inicio)}`);
        if(filtros.fim){
            params.push(`fim=${encodeURIComponent(filtros.fim)}`);
        }
    }

    //Adicionando os filtros por categorias
    if(filtros.categorias.length > 0){
        filtros.categorias.forEach(cat => {
            params.push(`cat_id=${encodeURIComponent(cat)}`);
        });
    }

    //Retornando a url atualizada
    return url + params.join('&');
}