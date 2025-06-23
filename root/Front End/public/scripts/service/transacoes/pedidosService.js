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