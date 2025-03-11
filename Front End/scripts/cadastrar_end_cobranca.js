document.getElementById('formEndCobranca').addEventListener('submit', function (e) {
    e.preventDefault();

    const enderecoCobranca = {
        end_estado: document.getElementById('estado_c').value,
        end_cidade: document.getElementById('cidade_c').value,
        end_bairro: document.getElementById('bairro_c').value,
        end_endereco: document.getElementById('endereco_c').value,
        end_numero: document.getElementById('numero_c').value,
        end_complemento: document.getElementById('complemento_c').value,
        end_cep: document.getElementById('cep_c').value,
        usuario_usr_id: 1 
    };

    fetch('http://localhost:3000/api/enderecos-cobranca', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(enderecoCobranca)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        window.location.href = 'cadastrar_end_entrega.html';
    })
    .catch(error => console.error('Erro:', error));
});