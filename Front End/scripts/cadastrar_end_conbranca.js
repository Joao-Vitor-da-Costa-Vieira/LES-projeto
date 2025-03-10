document.getElementById('formEndCobranca').addEventListener('submit', async function (event) {
  event.preventDefault();

  const dadosEnderecoCobranca = {
      cidade_c: document.getElementById('cidade_c').value,
      bairro_c: document.getElementById('bairro_c').value,
      estado_c: document.getElementById('estado_c').value,
      endereco_c: document.getElementById('endereco_c').value,
      numero_c: document.getElementById('numero_c').value,
      complemento_c: document.getElementById('complemento_c').value,
      cep_c: document.getElementById('cep_c').value
  };

  try {
      const response = await fetch('/api/cadastrar_end_cobranca', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(dadosEnderecoCobranca)
      });

      if (response.ok) {
          alert('Endereço de cobrança cadastrado com sucesso!');
          window.location.href = '/cadastrar_end_entrega';
      } else {
          const errorData = await response.json();
          alert('Erro ao cadastrar endereço de cobrança: ' + (errorData.error || 'Erro desconhecido'));
      }
  } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao cadastrar endereço de cobrança');
  }
});