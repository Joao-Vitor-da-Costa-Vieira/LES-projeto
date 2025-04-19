import {getHome} from "/scripts/service/telaInicialService.js";
import {getHomeAdm} from "/scripts/service/telaInicialService.js";

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.botao-usuario').forEach(botao => {
        botao.addEventListener('click', (event) => {
            event.stopPropagation();
            console.log("Botão clicado!");
            getHome('1');
        });
    });

    document.querySelectorAll('.botao-adm').forEach(botao => {
        botao.addEventListener('click', (event) => {
            event.stopPropagation();
            console.log("Botão clicado!");
            getHomeAdm;
        });
    });
});



