document.getElementById('formEndEntrega').addEventListener('submit', function (e) {
    e.preventDefault();

    const enderecoEntrega = {
        end_estado: document.getElementById('estado_e').value,
        end_cidade: document.getElementById('cidade_e').value,
        end_bairro: document.getElementById('Bairro_e').value,
        end_endereco: document.getElementById('endereco_e').value,
        end_numero: document.getElementById('numero_e').value,
        end_complemento: document.getElementById('complemento_e').value,
        end_cep: document.getElementById('cep_e').value,
        usuario_usr_id: 1 // Substitua pelo ID do usuário logado ou obtenha dinamicamente
    };

    fetch('http://localhost:3000/api/enderecos-entrega', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(enderecoEntrega)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        window.location.href = 'cadastrar_cartao.html'; 
    })
    .catch(error => console.error('Erro:', error));
});