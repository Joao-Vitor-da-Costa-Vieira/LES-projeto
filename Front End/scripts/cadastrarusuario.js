document.getElementById('formCadastro').addEventListener('submit', function (event) {
    event.preventDefault(); // Impede o envio padrão do formulário
    console.log('Formulário enviado via JavaScript'); // Verifique se essa mensagem aparece no console
  
    // Captura os dados do formulário
    const formData = {
      nome: document.getElementById('nome').value,
      email: document.getElementById('E-mail').value,
      cpf: document.getElementById('CPF').value,
      senha: document.getElementById('senha').value,
      data_nascimento: document.getElementById('data').value,
      telefone1: document.getElementById('telefone1').value,
      telefone2: document.getElementById('telefone2').value,
      genero: document.querySelector('input[name="genero"]:checked').value
    };
  
    console.log('Dados do formulário:', formData); // Verifique se os dados estão corretos
  
    // Envia os dados para o backend
    fetch('http://localhost:3000/usuario/cadastrar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          alert(data.message); // Exibe mensagem de sucesso
          window.location.href = 'index.html'; // Redireciona para a página inicial
        } else {
          alert('Erro ao cadastrar usuário: ' + data.error);
        }
      })
      .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao cadastrar usuário');
      });
  });