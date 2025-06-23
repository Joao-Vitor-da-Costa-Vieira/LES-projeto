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
        fetch('/devolucoes/confirmar', {
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
    .then(response => {
        if (!response.ok) throw new Error('Erro na solicitação');
        return response;
    })
    .then(data => {
        if (data.success) {
            const usr_id = usr_id;

            alert('Devolução solicitada!')
            window.location.href = `/pagamento/historico?usr_id=${usr_id}`;
            
        } else {
            alert(data.message || 'Erro ao processar devolucao');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao processar solicitação');
    });
    } catch (error) {
        console.error(`Erro no confirmarDevolucao - serviceDevolucoes: ${err}`);
        throw err;
    }
    
}