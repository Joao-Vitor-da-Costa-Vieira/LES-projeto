document.getElementById('formEndCobranca').addEventListener('submit', function (event) {
    event.preventDefault(); // Impede o envio padrão do formulário
    console.log('Formulário armazenado');

    // Captura os dados do formulário
    const dadosEndCobranca = {
      cidade: document.getElementById('cidade_c').value,
      bairro: document.getElementById('bairro_c').value,
      estado: document.getElementById('estado_c').value,
      endereco: document.getElementById('endereco_c').value,
      numero: document.getElementById('numero_c').value,
      complemento: document.getElementById('complemento_c').value,
      cep: document.getElementById('cep_c').value
    };
  

    localStorage.setItem('dadosEndCobranca', JSON.stringify(dadosEndCobranca));
  
    window.location.href = '../view/cadastrar_end_entrega.html';
  });