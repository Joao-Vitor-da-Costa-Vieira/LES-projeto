import { cadastroService } from "../../service/usuario/cadastroService.js";

document.getElementById('formCadastro').addEventListener('submit', async function (event) {
  event.preventDefault();

    // Captura os valores dos campos
    const formDados = new FormData(event.target);
    const dados = Object.fromEntries(formDados.entries());

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

    const usuario = {
        usr_nome: dados.nome, 
        usr_email: dados.email, 
        usr_cpf: dados.cpf,
        usr_data_de_nascimento: dados.data_nascimento, 
        usr_telefone1: dados.telefone1,
        usr_telefone2: dados.telefone2,
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

    

    const cadastroDados = {usuario, endereco_e, endereco_c, cartao}; 
    
    const status = await cadastroService(cadastroDados);
    
    if(status === 200){
        alert('Cliente foi Cadastrado com Sucesso!');
        return;
    }
    
    alert('Não foi posível cadastrar o cliente');
});

// Função para validar a senha
function validarSenha(senha) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(senha);
}