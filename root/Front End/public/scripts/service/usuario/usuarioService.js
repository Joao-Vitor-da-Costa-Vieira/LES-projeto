// Alterando a senha do usuário
export async function atualizarSenhaUsuarioService(senha, id) {
    try {
        let res = await fetch(`/senha/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(senha)
        });

        return res.status;
    } catch (err) {
        console.error(`Erro no alterarSenhaUsuarioService - serviceUsuarios: ${err}`);
        return 500;
    }
}

// Inativar um usuário
export async function inativarUsuarioService(id) {
    try {
        let res = await fetch(`/usuarios/inativar/${id}`, { method: 'PATCH' });
        return res.status;
    } catch (err) {
        console.error(`Erro no inativarUsuarioService - serviceUsuarios: ${err}`);
        return 500;
    }
}

// Ativar um usuário
export async function ativarUsuarioService(id) {
    try {
        let res = await fetch(`/usuarios/ativar/${id}`, { method: 'PATCH' });
        return res.status;
    } catch (err) {
        console.error(`Erro no ativarUsuarioService - serviceUsuarios: ${err}`);
        return 500;
    }
}

// Pegando usuários por id
export async function buscarUsuarioIdService(id) {
    try {
        const res = await fetch(`/api/usuarios/id/${id}`);
        const usuario = await res.json();
        return usuario[0];
    } catch (err) {
        console.error(`Erro no buscarUsuarioIdService - serviceUsuarios: ${err}`);
        throw err;
    }
}

// Pegando usuários ativos
export async function buscarUsuariosAtivosService() {
    try {
        const res = await fetch(`/api/usuarios/ativos`);
        const usuarios = await res.json();
        return usuarios;
    } catch (err) {
        console.error(`Erro no buscarUsuariosAtivosService - serviceUsuarios: ${err}`);
        throw err;
    }
}

// Pegando usuários inativos
export async function buscarUsuariosInativosService() {
    try {
        const res = await fetch(`/api/usuarios/inativos`);
        const usuarios = await res.json();
        return usuarios;
    } catch (err) {
        console.error(`Erro no buscarUsuariosInativosService - serviceUsuarios: ${err}`);
        throw err;
    }
}

export async function getClientes(id) {
    try {
        window.location.href = `/usuarios?adm_id=${id}`;
    } catch (error) {
        console.error(`Erro no getClientes - serviceUsuarios: ${err}`);
        throw err;
    }
}

export async function getInativos(id) {
    try {
        window.location.href = `/inativos?adm_id=${id}`;
    } catch (error) {
        console.error(`Erro no getInativos - serviceUsuarios: ${err}`);
        throw err;
    }
}

export function userNameDisplay() {
    const userName = localStorage.getItem('currentUserName');
    const userNameDisplay = document.querySelector('.usuario-nome');

    userNameDisplay.textContent = userName || 'Visitante';
}

export async function getUserId(){
    
    const usuarioId = localStorage.getItem('currentUserId');

    return usuarioId;
}