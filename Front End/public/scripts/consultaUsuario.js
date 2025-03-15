document.getElementById('formConsulta').addEventListener('submit', function (e) {
    e.preventDefault();

    // Captura os valores do formulário
    const coluna = document.getElementById('coluna').value;
    const valor = document.getElementById('valor').value;

    // Verifica se o campo de valor está vazio
    if (!valor.trim()) {
        alert("O campo de valor não pode estar vazio.");
        return;
    }

    // Envia os dados para o backend
    fetch('http://localhost:3000/api/usuarios/consultar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ coluna, valor })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Redireciona para a página de resultados com os dados
            window.location.href = `resultadoUsuario.html?dados=${encodeURIComponent(JSON.stringify(data.resultados))}`;
        } else {
            alert(data.message || "Nenhum resultado encontrado.");
            window.location.href = 'consultarusuario.html'; 
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert("Erro ao consultar usuário. Tente novamente mais tarde.");
        window.location.href = 'consultarusuario.html';
    });
});