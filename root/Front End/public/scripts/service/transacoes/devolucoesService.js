export async function solicitarDevolucao(id) {
    try {
        window.location.href = `/devolucoes?tra_id=${id}`;
    } catch (error) {
        console.error(`Erro no solicitarDevolucao - serviceDevolucoes: ${err}`);
        throw err;
    }
}

export async function confirmarDevolucao(usr_id, itensTroca, subtotal, tra_id, end_id) {
    
    try {
        const response = await fetch('/devolucoes/confirmar', {
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
        
    } catch (error) {
        console.error(`Erro no confirmarDevolucao - serviceDevolucoes: ${error}`);
        throw error;
    }
    
}