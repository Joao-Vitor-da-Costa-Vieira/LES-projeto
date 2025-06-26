document.addEventListener('DOMContentLoaded', async () => {
    const userDataElement = document.getElementById('user-data');
    const usuarioId = userDataElement.getAttribute('data-user-id');
    
    document.querySelectorAll('.home-link').forEach(botao => {
        botao.addEventListener('click', (event) => {
            event.stopPropagation();
            console.log("Botão clicado!");
            getHomeAdm(usuarioId);
        });
    });

    document.querySelectorAll('#').forEach(botao => {
        botao.addEventListener('click', (event) => {
            event.stopPropagation();
            console.log("Botão clicado!");
            getCarrinho(usuarioId);
        });
    });
});


