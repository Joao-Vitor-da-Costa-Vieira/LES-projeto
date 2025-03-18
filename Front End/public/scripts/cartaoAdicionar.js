import { cadastrarCartaoService } from "/scripts/service/cartaoService.js";

// Enviando os dados para o backend
document.querySelector('form').addEventListener('submit', async function(event){
    event.preventDefault();

    // Pegando os dados do formulário
    const formDados = new FormData(event.target);
    let dados = Object.fromEntries(formDados.entries());

    // Pegando o id do usuário
    const usr_id = window.location.pathname.split('/')[2];

    const cartao = {
        crt_usr_id: usr_id,
        crt_numero: dados.numero_cartao,
        crt_nome: dados.nome_cartao,
        crt_bandeira: dados.bandeira_cartao,
        crt_codigo_seguranca: dados.codigo_seguranca,
    }

    // Passando os dados para o back
    let result = await cadastrarCartaoService(cartao, usr_id);
    
    if(result.status === 200){
        alert('Cartão foi cadastrado com sucesso!');
        return;
    }

    alert('Não foi possível cadastrar o cartão');
});