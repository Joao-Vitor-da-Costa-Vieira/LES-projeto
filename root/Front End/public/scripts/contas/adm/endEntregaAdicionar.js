import { cadastrarEnderecoEntregaService } from "/scripts/service/usuario/enderecoEntregaService.js";

// Enviando os dados para o backend
document.querySelector('form').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Pegando os dados do formulário
    const formDados = new FormData(event.target);
    let dados = Object.fromEntries(formDados.entries());

    // Pegando o id do usuário
     const usr_id = document.getElementById('id').value;

    const endereco = {
        usuarios_usr_id: usr_id,
        end_bairro: dados.bairro,
        end_cep: dados.cep,
        end_cidade: dados.cidade,
        end_estado: dados.estado,
        end_endereco: dados.endereco, 
        end_numero: dados.numero,
        end_complemento: dados.complemento
    };

    // Passando os dados para o back
    let result = await cadastrarEnderecoEntregaService(endereco, usr_id);

    if (result.status === 200) {
        alert('Endereço foi cadastrado com sucesso!');
        return;
    }

    alert('Não foi possível cadastrar o endereço');
});