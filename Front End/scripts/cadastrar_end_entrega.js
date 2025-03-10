document.getElementById('formEndEntrega').addEventListener('submit', async function (event) {
    event.preventDefault();
  
    const dadosEnderecoEntrega = {
        cidade_e: document.getElementById('cidade_e').value,
        bairro_e: document.getElementById('bairro_e').value,
        estado_e: document.getElementById('estado_e').value,
        endereco_e: document.getElementById('endereco_e').value,
        numero_e: document.getElementById('numero_e').value,
        complemento_e: document.getElementById('complemento_e').value,
        cep_e: document.getElementById('cep_e').value
    };
  
    try {
        const response = await fetch('/api/cadastrar_end_entrega', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosEnderecoEntrega)
        });
  
        if (response.ok) {
            alert('Endereço de entrega cadastrado com sucesso!');
            window.location.href = '/index';
        } else {
            const errorData = await response.json();
            alert('Erro ao cadastrar endereço de entrega: ' + (errorData.error || 'Erro desconhecido'));
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao cadastrar endereço de entrega');
    }
  });