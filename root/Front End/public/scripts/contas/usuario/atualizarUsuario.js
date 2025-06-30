import { cadastroAtualizarService } from "/scripts/service/usuario/cadastroService.js";
import { getUserId } from "/scripts/service/usuario/usuarioService.js";

function validarSenha(senha) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(senha);
}

// PASSANDO OS DADOS PARA ATUALIZAÇÃO
document.querySelector('form').addEventListener('submit', async function (event) {
    event.preventDefault();

    // Pegando dados do formulário
    const formDados = new FormData(event.target);
    let dados = Object.fromEntries(formDados.entries());

    // Pegando o ID do usuário
    const usr_id = await getUserId();

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
        usr_email: dados.email, 
        usr_cpf: dados.cpf,
        usr_data_de_nascimento: dados.data, 
        usr_telefone_1: dados.telefone1,
        usr_telefone_2: dados.telefone2,
        usr_genero: dados.genero,
        usr_senha: dados.senha
    };

    const status = await cadastroAtualizarService(usuario, usr_id);

    if (status === 200) {
        alert('Usuário foi atualizado com sucesso!');
        return;
    }

    alert('Não foi possível atualizar o usuário');
});