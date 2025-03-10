document.getElementById('formUsuario').addEventListener('submit', function (e) {
  e.preventDefault();

  const usuario = {
      nome: document.getElementById('nome').value,
      email: document.getElementById('E-mail').value,
      cpf: document.getElementById('cpf').value,
      senha: document.getElementById('senha').value,
      data_nascimento: document.getElementById('data_nascimento').value,
      telefone1: document.getElementById('telefone1').value,
      telefone2: document.getElementById('telefone2').value,
      genero: document.querySelector('input[name="genero"]:checked').value
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
      alert(data.message);
      window.location.href = 'index.html'; // Redireciona após o cadastro
  })
  .catch(error => console.error('Erro:', error));
});