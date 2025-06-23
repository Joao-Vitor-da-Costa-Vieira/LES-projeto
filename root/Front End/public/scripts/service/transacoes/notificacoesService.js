export async function buscarNotificacoes(id){
    try{
        const response = await fetch(`/notificacoes?usr_id=${id}`);
        return response;
    }catch(err){
        console.error(`Erro no buscarNotificacaoes - serviceNotificacoes: ${err}`);
        throw err;
    }
}

export async function deletarNotificacao(id) {
    try{
        const response = await fetch(`/notificacoes/${id}`, { method: 'DELETE' });
        return response;
    }catch(err){
        console.error(`Erro no deletarNotificacaoes - serviceNotificacoes: ${err}`);
        throw err;
    }
}