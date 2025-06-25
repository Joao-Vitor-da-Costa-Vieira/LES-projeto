import { cadastroAtualizarService } from "/scripts/service/usuario/cadastroService.js";

// PASSANDO OS DADOS PARA ATUALIZAÇÃO
document.querySelector('form').addEventListener('submit', async function (event) {
    event.preventDefault();

    // Pegando dados do formulário
    const formDados = new FormData(event.target);
    let dados = Object.fromEntries(formDados.entries());

    // Pegando o ID do usuário
    const userDataElement = document.getElementById('user-data');
    const usr_id = userDataElement ? userDataElement.dataset.userId : null;;

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

    const status = await cadastroAtualizarService(usuario, usr_id);

    if (status === 200) {
        alert('Usuário foi atualizado com sucesso!');
        return;
    }

    alert('Não foi possível atualizar o usuário');
});