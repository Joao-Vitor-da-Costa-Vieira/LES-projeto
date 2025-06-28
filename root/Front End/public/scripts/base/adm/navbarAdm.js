import {
    getClientes,
    getInativos,
    getAdmId,
    admNameDisplay  } from "/scripts/service/usuario/usuarioService.js";
import { getHomeAdm } from "/scripts/service/telaInicialService.js";

document.addEventListener('DOMContentLoaded', async () => {
    admNameDisplay();

    const admId = await getAdmId();
    
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

    document.querySelectorAll('#inativos').forEach(botao => {
        botao.addEventListener('click', async (event) => {
            event.stopPropagation();
            await getInativos(admId);
        });
    });
});


