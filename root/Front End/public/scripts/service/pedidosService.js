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