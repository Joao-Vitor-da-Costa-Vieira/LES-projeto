export async function getPedidos(id) {
    try {
        window.location.href = `/pedidos?adm_id=${id}`;
    } catch (err) {
        console.error("Falha no fetch:", err);
        throw err;
    }
}

export async function getEstoque(id) {
    try {
        window.location.href = `/estoque?adm_id=${id}`;
    } catch (err) {
        console.error("Falha no fetch:", err);
        throw err;
    }
}

export async function getAnalise(id) {
    try {
        window.location.href = `/analise?adm_id=${id}`;
    } catch (err) {
        console.error("Falha no fetch:", err);
        throw err;
    }
}