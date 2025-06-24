// Cadastrando um cartão no banco de dados
export async function cadastrarCartaoService(dados, usr_id) {
    try {
        const result = await fetch(`/cartao/${usr_id}/adicionar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        return result;
    } catch (err) {
        console.error(`Erro no cadastrarCartaoService - serviceCartao: ${err}`);
        throw err;
    }
}

// Atualizando os cartões do banco de dados
export async function atualizarCartaoService(dados, usr_id, crt_id) {
    try {
        const result = await fetch(`/cartao/${usr_id}/atualizar/${crt_id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        return result;
    } catch (err) {
        console.error(`Erro no atualizarCartaoService - serviceCartao: ${err}`);
        throw err;
    }
}

export async function getAtualizarCartao(id,usr_id) {
    try {
        window.location.href = `/cartao/atualizar?usr_id=${encodeURIComponent(usr_id)}&crt_id=${encodeURIComponent(id)}`;
    } catch (error) {
        console.error(`Erro no atualizarCartao - serviceCartao: ${err}`);
        throw err;
    }
}

export async function getAdicionarCartao(usr_id) {
    try {
        window.location.href = `/cartao/adicionar?usr_id=${encodeURIComponent(usr_id)}`;
    } catch (error) {
        console.error(`Erro no adicionarCartao - serviceCartao: ${err}`);
        throw err;
    }
}