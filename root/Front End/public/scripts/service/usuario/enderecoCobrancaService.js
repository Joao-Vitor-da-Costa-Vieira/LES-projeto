// Cadastro de novo endereço de cobrança no banco
export async function cadastrarEnderecoCobrancaService(dados, usr_id) {
    try {
        const result = await fetch(`/endereco-cobranca/${usr_id}/adicionar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        return result;

    } catch (err) {
        console.error(`Erro no cadastrarEnderecoCobrancaService - serviceEnderecoCobranca: ${err}`);
        throw err;
    }
}

// Atualizando o endereço de cobrança no banco de dados
export async function atualizarEnderecoCobrancaService(dados, usr_id, end_id) {
    try {
        const result = await fetch(`/endereco-cobranca/${usr_id}/atualizar/${end_id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        return result;

    } catch (err) {
        console.error(`Erro no atualizarEnderecoCobrancaService - serviceEnderecoCobranca: ${err}`);
        throw err;
    }
}

// Pegando endereço de cobrança por id
export async function buscarEnderecoCobrancaIdService(id) {
    try {
        const res = await fetch(`/api/endereco-cobranca/${id}`);
        const endereco = await res.json();
        return endereco[0];

    } catch (err) {
        console.error(`Erro no buscarEnderecoCobrancaIdService - serviceEnderecoCobranca: ${err}`);
        throw err;
    }
}

export async function atualizarEndCobranca(path) {
    try {
        window.location.href = path;
    } catch (error) {
        console.error(`Erro no atualizarEndCobranca - serviceEndCobranca: ${err}`);
        throw err;
    }
}