export async function getSenha(id) {
    
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
    
}

export async function getEndEntrega(id) {
    
}

export async function getEndCobranca(id) {
    
}