export async function solicitarTroca(id) {
    try {
        window.location.href = `/trocas?tra_id=${id}`;
    } catch (error) {
        console.error(`Erro no solicitarTroca - serviceTrocas: ${err}`);
        throw err;
    }
}

export async function confirmarTroca(usr_id, itensTroca, subtotal, tra_id, end_id) {
    try {
        const response = await fetch('/trocas/confirmar', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            usr_id: usr_id,
            itens: itensTroca,
            subtotal,
            tra_id: tra_id[0],
            end_id: end_id
            })
        })

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Erro ao processar troca');
        }

        alert(result.message || 'Troca solicitada com sucesso!');
        window.location.href = `/pagamento/historico?usr_id=${usr_id}`;
        
        return result;
    } catch (error) {
        console.error(`Erro no confirmarTroca - serviceTrocas: ${error}`);
        throw error;
    }
}