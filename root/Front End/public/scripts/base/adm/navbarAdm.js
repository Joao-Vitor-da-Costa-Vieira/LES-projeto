import { getClientes } from "/scripts/service/usuario/usuarioService";
import { getHomeAdm } from "/scripts/service/telaInicialService";

document.addEventListener('DOMContentLoaded', async () => {
    const admDataElement = document.getElementById('adm-data');
    const admId = admDataElement.getAttribute('data-adm-id');
    
    document.querySelectorAll('.home-link').forEach(botao => {
        botao.addEventListener('click', (event) => {
            event.stopPropagation();
            console.log("Botão clicado!");
            getHomeAdm(admId);
        });
    });

    document.querySelectorAll('#clientes').forEach(botao => {
        botao.addEventListener('click', (event) => {
            event.stopPropagation();
            getClientes(admId);
        });
    });
});


