import { atualizarEnderecoCobrancaService } from "/scripts/service/usuario/enderecoCobrancaService.js";

// Enviando os dados para o backend
document.querySelector('form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formDados = new FormData(event.target);
    let dados = Object.fromEntries(formDados.entries());

    // Pegando o id do usuário
    const usr_id = dados.id;

    const enderecoElement = document.querySelector('.endereco-id');
    const end_id = enderecoElement ? enderecoElement.dataset.enderecoId : null;


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
    let result = await atualizarEnderecoCobrancaService(endereco, usr_id, end_id);

    if (result.status === 200) {
        alert('Endereço foi atualizado com sucesso!');
        return;
    }

    alert('Não foi possível atualizar o endereço');
});