import { cadastrarCartaoService } from "/scripts/service/usuario/cartaoService.js";
import { getUserId } from "/scripts/service/usuario/usuarioService.js";

// Enviando os dados para o backend
document.querySelector('form').addEventListener('submit', async function(event){
    event.preventDefault();

    // Pegando os dados do formulário
    const formDados = new FormData(event.target);
    let dados = Object.fromEntries(formDados.entries());

    // Pegando o id do usuário
    const usr_id = await getUserId();


    const cartao = {
        crt_usr_id: usr_id,
        crt_numero: dados.num_cartao,
        crt_nome: dados.nome_c,
        crt_bandeira: dados.bandeira,
        crt_codigo_seguranca: dados.cod_sec,
    }

    // Passando os dados para o back
    let result = await cadastrarCartaoService(cartao, usr_id);
    
    if(result.status === 200){
        alert('Cartão foi cadastrado com sucesso!');
        return;
    }

    alert('Não foi possível cadastrar o cartão');
});