document.getElementById('formUsuario').addEventListener('submit', async function (event) {
  event.preventDefault();


  const dadosUsuario = {
    nome: document.getElementById('nome').value,
    email: document.getElementById('email').value,
    cpf: document.getElementById('cpf').value,
    senha: document.getElementById('senha').value,
    data_nascimento: document.getElementById('data_nascimento').value,
    telefone1: document.getElementById('telefone1').value,
    telefone2: document.getElementById('telefone2').value,
    genero: document.querySelector('input[name="genero"]:checked').value
  };


  try {
    const response = await fetch('http://localhost:3000/usuario/cadastrar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dadosUsuario)
    });

    const data = await response.json();

    if (data.message) {
      alert('Usuário cadastrado com sucesso!');
      window.location.href = 'cadastrar_end_cobranca.html';
    } else {
      alert('Erro ao cadastrar usuário: ' + data.error);
    }
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao cadastrar usuário');
  }
});