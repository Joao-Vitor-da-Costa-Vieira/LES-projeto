document.getElementById('formCartao').addEventListener('submit', function (e) {
    e.preventDefault();

    const cartao = {
        crt_numero: document.getElementById('num_cartao').value,
        crt_codigo_seguranca: document.getElementById('cod_sec').value,
        crt_bandeira: document.getElementById('bandeira').value,
        crt_nome: document.getElementById('nome_c').value,
        usuario_usr_id: 1 
    };

    fetch('http://localhost:3000/api/cartao', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cartao)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        window.location.href = 'mostrarCadastro.html'; 
    })
    .catch(error => console.error('Erro:', error));
});