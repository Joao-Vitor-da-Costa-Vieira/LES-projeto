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

        return response;
    } catch (err) {
        console.error(`Erro no adicionarCarrinho: ${err}`);
        throw err;
    }
}

export async function alterarCarrinho(lvr_id, usr_id, quantidade) {
    try {
        const response = await fetch('/carrinho/alterar', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                lvr_id, 
                usr_id,
                quantidade 
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Erro na requisição');
        }

        return data;
    } catch (err) {
        console.error(`Erro no alterarCarrinho: ${err}`);
        throw err;
    }
}

export async function deletarCarrinho(car_id) {
    try {
        const response = await fetch('/carrinho/deletar', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                car_id
            })
        });

        if (!response.ok) {
            throw new Error('Erro na requisição');
        }

        return await response.json();
    } catch (err) {
        console.error(`Erro no deletarCarrinho: ${err}`);
        throw err;
    }
}

export async function getCarrinho(usr_id) {
    try {
        window.location.href = `/carrinho?usr_id=${encodeURIComponent(usr_id)}`;
    } catch (err) {
        console.error(`Erro no getCarrinho: ${err}`);
        throw err;
    }
}