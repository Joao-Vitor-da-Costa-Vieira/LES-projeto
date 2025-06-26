import { getClientes } from "/scripts/service/usuario/usuarioService.js";
import { getHomeAdm } from "/scripts/service/telaInicialService.js";

document.addEventListener('DOMContentLoaded', async () => {
    const admDataElement = document.getElementById('adm-data');
    const admId = admDataElement.getAttribute('data-adm-id');
    
    document.querySelectorAll('.home-link').forEach(botao => {
        botao.addEventListener('click', async (event) => {
            event.stopPropagation();
            console.log("Botão clicado!");
             await getHomeAdm(admId);
        });
    });

    document.querySelectorAll('#Clientes').forEach(botao => {
        botao.addEventListener('click', async (event) => {
            event.stopPropagation();
            await getClientes(admId);
        });
    });
});


