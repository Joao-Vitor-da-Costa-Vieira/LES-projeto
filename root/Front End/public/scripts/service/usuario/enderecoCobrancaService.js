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

export async function getAtualizarEndCobranca(id,usr_id) {
    try {
        window.location.href = `/endereco-cobranca/atualizar?usr_id=${encodeURIComponent(usr_id)}&end_id=${encodeURIComponent(id)}`;
    } catch (error) {
        console.error(`Erro no atualizarEndCobranca - serviceEndCobranca: ${err}`);
        throw err;
    }
}

export async function getAdicionarEndCobranca(usr_id) {
    try {
        window.location.href = `/endereco-cobranca/adicionar?usr_id=${encodeURIComponent(usr_id)}`;
    } catch (error) {
        console.error(`Erro no adicionarEndCobranca - serviceEndCobranca: ${err}`);
        throw err;
    }
}