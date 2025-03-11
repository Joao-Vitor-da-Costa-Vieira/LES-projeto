function alterarStatus(usuarioId, novoStatus) {
    fetch(`http://localhost:3000/api/usuarios/${usuarioId}/atualizar-status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ novoStatus })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            // Recarrega os dados do backend e exibe na página
            buscarDadosEExibir(usuarioId);
        } else {
            alert(data.message || "Erro ao alterar status.");
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert("Erro ao alterar status. Tente novamente mais tarde.");
    });
}

// Função para buscar os dados atualizados e exibir na página
function buscarDadosEExibir(usuarioId) {
    fetch(`http://localhost:3000/api/usuarios/${usuarioId}`)
        .then(response => response.json())
        .then(usuario => {
            // Verifica se o usuário possui endereços de cobrança e entrega
            fetch(`http://localhost:3000/api/usuarios/${usuarioId}/verificar-enderecos`)
                .then(response => response.json())
                .then(data => {
                    const possuiEnderecos = data.possuiEnderecos;

                    // Define o status como "Ativo" ou "Inativo"
                    const status = (usuario.usr_status_de_atividade === 1 && possuiEnderecos) ? "Ativo" : "Inativo";

                    // Atualiza a exibição dos dados na página
                    const divResultados = document.getElementById('resultados');
                    divResultados.innerHTML = `
                        <p><strong>Nome:</strong> ${usuario.usr_nome}</p>
                        <p><strong>E-mail:</strong> ${usuario.usr_email}</p>
                        <p><strong>CPF:</strong> ${usuario.usr_cpf}</p>
                        <p><strong>Telefone 1:</strong> ${usuario.usr_telefone_1}</p>
                        <p><strong>Telefone 2:</strong> ${usuario.usr_telefone_2 || 'N/A'}</p>
                        <p><strong>Gênero:</strong> ${usuario.usr_genero}</p>
                        <p><strong>Status de Atividade:</strong> ${status}</p>
                        <hr>
                    `;
                })
                .catch(error => {
                    console.error('Erro ao verificar endereços:', error);
                });
        })
        .catch(error => {
            console.error('Erro ao buscar dados do usuário:', error);
        });
}