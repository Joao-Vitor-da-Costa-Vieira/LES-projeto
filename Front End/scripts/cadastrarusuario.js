document.getElementById('formUsuario').addEventListener('submit', function (e) {
  e.preventDefault();

  const usuario = {
    usr_nome: document.getElementById('nome').value,
    usr_email: document.getElementById('E-mail').value,
    usr_cpf: document.getElementById('cpf').value,
    usr_senha: document.getElementById('senha').value, 
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
      alert(data.message);
      window.location.href = 'index.html'; 
  })
  .catch(error => console.error('Erro:', error));
});