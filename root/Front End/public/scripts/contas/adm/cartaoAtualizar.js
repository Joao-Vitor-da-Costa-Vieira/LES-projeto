import { getHome } from "/scripts/service/telaInicialService.js";
import { atualizarCartaoService } from "/scripts/service/usuario/cartaoService.js";

// Enviando os dados para o backend
document.querySelector('form').addEventListener('submit', async function(event){
    event.preventDefault();

    const formDados = new FormData(event.target);
    let dados = Object.fromEntries(formDados.entries());

    // Pegando o id do cliente e do cartão
     const usr_id = document.getElementById('id').value;

    const cartaoElement = document.querySelector('.cartoes-id');
    const crt_id = cartaoElement ? cartaoElement.dataset.cartaoId : null;

    const cartao = {
        crt_numero: dados.num_cartao,
        crt_nome: dados.nome_c,
        crt_bandeira: dados.bandeira,
        crt_codigo_seguranca: dados.cod_sec,
    }

    // Passando os dados para o back
    let result = await atualizarCartaoService(cartao, usr_id, crt_id);
    
    if(result.status === 200){
        alert('Cartão foi atualizado com sucesso!');
        getHome(usr_id);
        return;
    }

    alert('Não foi possível atualizar o cartão');
});