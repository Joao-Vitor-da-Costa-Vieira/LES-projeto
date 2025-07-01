// Cadastro de novo endereço de entrega no banco
export async function cadastrarEnderecoEntregaService(dados, usr_id) {
    try {
        const result = await fetch(`/endereco-entrega/${usr_id}/adicionar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        return result;

    } catch (err) {
        console.error(`Erro no cadastrarEnderecoEntregaService - serviceEnderecoEntrega: ${err}`);
        throw err;
    }
}

// Atualizando o endereço de entrega no banco de dados
export async function atualizarEnderecoEntregaService(dados, usr_id, end_id) {
    try {
        const result = await fetch(`/endereco-entrega/${usr_id}/atualizar/${end_id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        return result;

    } catch (err) {
        console.error(`Erro no atualizarEnderecoEntregaService - serviceEnderecoEntrega: ${err}`);
        throw err;
    }
}

// Pegando endereço de entrega por id
export async function buscarEnderecoEntregaIdService(id) {
    try {
        const res = await fetch(`/api/endereco-entrega/${id}`);
        const endereco = await res.json();
        return endereco[0];

    } catch (err) {
        console.error(`Erro no buscarEnderecoEntregaIdService - serviceEnderecoEntrega: ${err}`);
        throw err;
    }
}

export async function getAtualizarEndEntrega(id,usr_id) {
    try {
        window.location.href = `/endereco-entrega/atualizar?usr_id=${encodeURIComponent(usr_id)}&end_id=${encodeURIComponent(id)}`;
    } catch (error) {
        console.error(`Erro no atualizarEndEntrega - serviceEndEntrega: ${err}`);
        throw err;
    }
}

export async function getAdicionarEndEntrega(usr_id) {
    try {
        window.location.href = `/endereco-entrega/adicionar?usr_id=${encodeURIComponent(usr_id)}`;
    } catch (error) {
        console.error(`Erro no adicionarEndEntrega - serviceEndEntrega: ${err}`);
        throw err;
    }
}


export async function getAtualizarEndEntregaAdm(id,usr_id) {
    try {
        window.location.href = `/endereco-entrega-adm/atualizar?usr_id=${encodeURIComponent(usr_id)}&end_id=${encodeURIComponent(id)}`;
    } catch (error) {
        console.error(`Erro no atualizarEndEntrega - serviceEndEntrega: ${err}`);
        throw err;
    }
}

export async function getAdicionarEndEntregaAdm(usr_id) {
    try {
        window.location.href = `/endereco-entrega-adm/adicionar?usr_id=${encodeURIComponent(usr_id)}`;
    } catch (error) {
        console.error(`Erro no adicionarEndEntrega - serviceEndEntrega: ${err}`);
        throw err;
    }
}