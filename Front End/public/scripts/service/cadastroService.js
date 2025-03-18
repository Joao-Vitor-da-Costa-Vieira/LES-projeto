//Atualizando dados de um usuario do banco de dados
export async function cadastroAtualizarService(usuario, usr_id) {
    try{

        const res = await fetch(`/cadastro/${usr_id}`, {
            method: 'PUT',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(usuario)
        });

        return res.status;

    }catch(err){
        console.error(`Erro no cadastroAtualizarService - serviceCadastro: ${err}`);
        throw err;
    }
}

//Inserindo um usuario no banco de dados
export async function cadastroService(usuario) {

    console.log('Enviando dados para o backend:', usuario);
    
    try{

        const res = await fetch('/cadastro', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(usuario)
        });

        return res.status;

    }catch(err){
        console.error(`Erro no cadastroService - serviceCadastro: ${err}`);
        throw err;
    }
}