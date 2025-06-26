import { getClientes } from "/scripts/service/usuario/usuarioService";
import { getHomeAdm } from "/scripts/service/telaInicialService";

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

    document.querySelectorAll('#clientes').forEach(botao => {
        botao.addEventListener('click', (event) => {
            event.stopPropagation();
            console.log("Botão clicado!");
            getClientes(usuarioId);
        });
    });
});


