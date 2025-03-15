document.getElementById('formCadastro').addEventListener('submit', function (e) {
  e.preventDefault();

    // Captura os valores dos campos
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('E-mail').value.trim();
    const cpf = document.getElementById('cpf').value.trim();
    const senha = document.getElementById('senha').value.trim();
    const confSenha = document.getElementById('conf_senha').value.trim();
    const dataNascimento = document.getElementById('data_nascimento').value.trim();
    const telefone1 = document.getElementById('telefone1').value.trim();
    const genero = document.getElementById('genero').value.trim()

    // Captura os valores dos campos de endereço (obrigatórios)
    const cidadeE = document.getElementById('cidade_e').value.trim();
    const bairroE = document.getElementById('Bairro_e').value.trim();
    const estadoE = document.getElementById('estado_e').value.trim();
    const enderecoE = document.getElementById('endereco_e').value.trim();
    const numeroE = document.getElementById('numero_e').value.trim();
    const cepE = document.getElementById('cep_e').value.trim();

    const cidadeC = document.getElementById('cidade_c').value.trim();
    const bairroC = document.getElementById('bairro_c').value.trim();
    const estadoC = document.getElementById('estado_c').value.trim();
    const enderecoC = document.getElementById('endereco_c').value.trim();
    const numeroC = document.getElementById('numero_c').value.trim();
    const cepC = document.getElementById('cep_c').value.trim();

    const numCartao = document.getElementById('num_cartao').value.trim();
    const codSec = document.getElementById('cod_sec').value.trim();
    const bandeira = document.getElementById('bandeira').value.trim();
    const nomeC = document.getElementById('nome_c').value.trim();

    // Esconde as mensagens de erro inicialmente
    document.querySelectorAll('.erro').forEach(function(erro) {
        erro.style.display = 'none';
    });

    // Validação dos campos obrigatórios do usuário
    let camposVazios = false;

    if (!nome) {
        document.getElementById('erroNome').style.display = 'inline';
        camposVazios = true;
    }
    if (!email) {
        document.getElementById('erroEmail').style.display = 'inline';
        camposVazios = true;
    }
    if (!cpf) {
        document.getElementById('erroCpf').style.display = 'inline';
        camposVazios = true;
    }
    if (!senha) {
        document.getElementById('erroSenha').style.display = 'inline';
        camposVazios = true;
    }
    if (!confSenha) {
        document.getElementById('erroConfSenha').style.display = 'inline';
        camposVazios = true;
    }
    if (!dataNascimento) {
        document.getElementById('erroData').style.display = 'inline';
        camposVazios = true;
    }
    if (!telefone1) {
        document.getElementById('erroTelefone1').style.display = 'inline';
        camposVazios = true;
    }
    if (!genero) {
        document.getElementById('erroGenero').style.display = 'inline';
        camposVazios = true;
    }

    if (!cidadeE) {
        document.getElementById('erroCidadeE').style.display = 'inline';
        camposVazios = true;
    }
    if (!bairroE) {
        document.getElementById('erroBairroE').style.display = 'inline';
        camposVazios = true;
    }
    if (!estadoE) {
        document.getElementById('erroEstadoE').style.display = 'inline';
        camposVazios = true;
    }
    if (!enderecoE) {
        document.getElementById('erroEnderecoE').style.display = 'inline';
        camposVazios = true;
    }
    if (!numeroE) {
        document.getElementById('erroNumeroE').style.display = 'inline';
        camposVazios = true;
    }
    if (!cepE) {
        document.getElementById('erroCepE').style.display = 'inline';
        camposVazios = true;
    }

    if (!cidadeC) {
        document.getElementById('erroCidadeC').style.display = 'inline';
        camposVazios = true;
    }
    if (!bairroC) {
        document.getElementById('erroBairroC').style.display = 'inline';
        camposVazios = true;
    }
    if (!estadoC) {
        document.getElementById('erroEstadoC').style.display = 'inline';
        camposVazios = true;
    }
    if (!enderecoC) {
        document.getElementById('erroEnderecoC').style.display = 'inline';
        camposVazios = true;
    }
    if (!numeroC) {
        document.getElementById('erroNumeroC').style.display = 'inline';
        camposVazios = true;
    }
    if (!cepC) {
        document.getElementById('erroCepC').style.display = 'inline';
        camposVazios = true;
    }

    if (!numCartao) {
        document.getElementById('erroNumCartao').style.display = 'inline';
        camposVazios = true;
    }
    if (!codSec) {
        document.getElementById('erroCodSec').style.display = 'inline';
        camposVazios = true;
    }
    if (!bandeira) {
        document.getElementById('erroBandeira').style.display = 'inline';
        camposVazios = true;
    }
    if (!nomeC) {
        document.getElementById('erroNomeC').style.display = 'inline';
        camposVazios = true;
    }

    if (camposVazios) {
        return;
    }

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