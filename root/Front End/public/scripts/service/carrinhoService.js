export async function adicionarCarrinho(lvr_id, usr_id, quantidade) {
    try {
        const response = await fetch('/carrinho/adicionar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                lvr_id, 
                usr_id,
                quantidade 
            })
        });

        if (!response.ok) {
            throw new Error('Erro na requisição');
        }

        return await response.json();
    } catch (err) {
        console.error(`Erro no adicionarCarrinho: ${err}`);
        throw err;
    }
}