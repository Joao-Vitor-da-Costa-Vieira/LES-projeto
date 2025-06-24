export async function getCadastro(id) {
    try {
        window.location.href = `/cadastro?usr_id=${encodeURIComponent(id)}`;
    } catch (err) {
        console.error("Falha no fetch:", err);
        throw err;
    }
}

export async function getCadastroPrimeiro() {
    try {
        window.location.href = `/cadastro-primeiro`;
    } catch (err) {
        console.error("Falha no fetch:", err);
        throw err;
    }
}

export async function getSenha(id) {
    try {
        window.location.href = `/senha?usr_id=${encodeURIComponent(id)}`;
    } catch (err) {
        console.error("Falha no fetch:", err);
        throw err;
    }
}

export async function getAtualizarCadastro(id) {
    try {
        window.location.href = `/atualizar?usr_id=${encodeURIComponent(id)}`;
    } catch (err) {
        console.error("Falha no fetch:", err);
        throw err;
    }
}

export async function getCartoes(id) {
    try {
        window.location.href = `/cartao?usr_id=${encodeURIComponent(id)}`;
    } catch (err) {
        console.error("Falha no fetch:", err);
        throw err;
    }
}

export async function getEndEntrega(id) {
    try {
        window.location.href = `/endereco-entrega?usr_id=${encodeURIComponent(id)}`;
    } catch (err) {
        console.error("Falha no fetch:", err);
        throw err;
    }
}

export async function getEndCobranca(id) {
    try {
        window.location.href = `/endereco-cobranca?usr_id=${encodeURIComponent(id)}`;
    } catch (err) {
        console.error("Falha no fetch:", err);
        throw err;
    }
}