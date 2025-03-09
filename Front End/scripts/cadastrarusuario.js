document.getElementById('formCadastro').addEventListener('submit', function (event) {
    event.preventDefault(); // Impede o envio padrão do formulário
    console.log('Formulário armazenado');
  
    // Captura os dados do formulário
    const dadosUsuario =  {
      nome: document.getElementById('nome').value,
      email: document.getElementById('E-mail').value,
      cpf: document.getElementById('cpf').value,
      senha: document.getElementById('senha').value,
      data_nascimento: document.getElementById('data_nascimento').value,
      telefone1: document.getElementById('telefone1').value,
      telefone2: document.getElementById('telefone2').value,
      genero: document.querySelector('input[name="genero"]:checked').value
    };
  
     localStorage.setItem('dadosUsuario', JSON.stringify(dadosUsuario));


  window.location.href = '../view/cadastrar_end_cobranca.html';
  
  });