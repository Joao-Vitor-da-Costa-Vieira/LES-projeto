import { atualizarEnderecoCobrancaService } from "/scripts/service/usuario/enderecoCobrancaService.js";
import { getUserId } from "/scripts/service/usuario/usuarioService.js";

// Enviando os dados para o backend
document.querySelector('form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formDados = new FormData(event.target);
    let dados = Object.fromEntries(formDados.entries());

    // Pegando o id do usuário
    const usr_id = await getUserId();

    const endereco = {
        end_usr_id: usr_id,
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