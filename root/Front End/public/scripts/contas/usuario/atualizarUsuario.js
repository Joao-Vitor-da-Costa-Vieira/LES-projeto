import { cadastroAtualizarService } from "../../service/usuario/cadastroService.js";

// PASSANDO OS DADOS PARA ATUALIZAÇÃO
document.querySelector('form').addEventListener('submit', async function (event) {
    event.preventDefault();

    // Pegando dados do formulário
    const formDados = new FormData(event.target);
    let dados = Object.fromEntries(formDados.entries());

    // Pegando o ID do usuário
    const usr_id = window.location.pathname.split('/').splice(-1)[0];

    // Valida se as senhas são iguais
    if (dados.senha !== dados.conf_senha) {
        document.getElementById('erroConfSenha').style.display = 'inline';
        document.getElementById('erroSenha').style.display = 'inline';
        return;
    }

    // Valida se a senha atende aos requisitos
    if (!validarSenha(dados.senha)) {
        document.getElementById('erroSenha').style.display = 'inline';
        return;
    }

    // Preparando os dados para passar para o back
    const usuario = {
        usr_nome: dados.nome, 
        usr_email: dados.E-mail, 
        usr_cpf: dados.cpf,
        usr_data_de_nascimento: dados.data_nascimento, 
        usr_telefone: dados.telefone1,
        usr_telefone: dados.telefone2,
        usr_genero: dados.genero,
        usr_senha: dados.senha
    };

    const endereco_e = {
        end_endereco: dados.endereco_e,
        end_numero: dados.numero_e,
        end_bairro: dados.bairro_e, 
        end_cidade: dados.cidade_e,
        end_estado: dados.estado_e,
        end_cep: dados.cep_e,
        end_complemento: dados.complemento_e
    };

    const endereco_c = {
        end_endereco: dados.endereco_c,
        end_numero: dados.numero_c,
        end_bairro: dados.bairro_c, 
        end_cidade: dados.cidade_c,
        end_estado: dados.estado_c,
        end_cep: dados.cep_c,
        end_complemento: dados.complemento_c 
    };

    const cartao = {
        crt_nome: dados.nome_c,
        crt_numero: dados.num_cartao,
        crt_bandeira: dados.bandeira, 
        crt_codigo_seguranca: dados.cod_sec
    };


    const cadastroDados = { usuario, endereco_e, endereco_c, cartao };

    console.log(cadastroDados);

    const status = await cadastroAtualizarService(cadastroDados, usr_id);

    if (status === 200) {
        alert('Usuário foi atualizado com sucesso!');
        return;
    }

    alert('Não foi possível atualizar o usuário');
});