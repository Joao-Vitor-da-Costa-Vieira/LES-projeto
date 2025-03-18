import { atualizarCartaoService } from "/scripts/service/serviceCartoes.js";

// Enviando os dados para o backend
document.querySelector('form').addEventListener('submit', async function(event){
    event.preventDefault();

    const formDados = new FormData(event.target);
    let dados = Object.fromEntries(formDados.entries());

    // Pegando o id do cliente e do cartão
    const usr_id = window.location.pathname.split('/')[2];
    const crt_id = window.location.pathname.split('/').splice(-1)[0];

    const cartao = {
        crt_numero: dados.numero_cartao,
        crt_nome: dados.nome_cartao,
        crt_bandeira: dados.bandeira_cartao,
        crt_codigo_seguranca: dados.codigo_seguranca,
    }

    // Passando os dados para o back
    let result = await atualizarCartaoService(cartao, usr_id, crt_id);
    
    if(result.status === 200){
        alert('Cartão foi atualizado com sucesso!');
        return;
    }

    alert('Não foi possível atualizar o cartão');
});