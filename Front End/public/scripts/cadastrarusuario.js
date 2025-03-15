document.getElementById('formCadastro').addEventListener('submit', function (e) {
  e.preventDefault();

    // Captura os valores dos campos
    const senha = document.getElementById('senha').value.trim();
    const confSenha = document.getElementById('conf_senha').value.trim();

    // Valida se as senhas são iguais
    if (senha !== confSenha) {
        document.getElementById('erroConfSenha').style.display = 'inline';
        document.getElementById('erroSenha').style.display = 'inline';
        return;
    }

    // Valida se a senha atende aos requisitos
    if (!validarSenha(senha)) {
        document.getElementById('erroSenha').style.display = 'inline';
        return;
    }


    // Se tudo estiver correto, envia os dados
    const usuario = {
        usr_nome: document.getElementById('nome').value,
        usr_email: document.getElementById('E-mail').value,
        usr_cpf: document.getElementById('cpf').value,
        usr_senha: senha, // Usa a senha já validada
        usr_data_de_nascimento: document.getElementById('data_nascimento').value,
        usr_telefone_1: document.getElementById('telefone1').value,
        usr_telefone_2: document.getElementById('telefone2').value,
        usr_genero: document.querySelector('input[name="genero"]:checked').value
    };

    fetch('http://localhost:3000/api/usuarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuario)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            window.location.href = 'cadastrar_end_cobranca.html'; // Redireciona após o sucesso
        } else {
            alert(data.message || "Erro ao cadastrar usuário.");
            window.location.href = 'cadastrarusuario.html'; // Redireciona em caso de erro
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert("Erro ao enviar dados. Tente novamente mais tarde.");
        window.location.href = 'cadastrarusuario.html'; // Redireciona em caso de erro
    });
});

    // Função para validar a senha
    function validarSenha(senha) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        return regex.test(senha);
    }