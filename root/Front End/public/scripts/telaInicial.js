import {getHome, getHomeAdm} from "/scripts/service/telaInicialService.js";

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.botao-usuario').forEach(botao => {
        botao.addEventListener('click', (event) => {
            event.stopPropagation();
            
            const usuarioId = document.getElementById('usuario').value;
            localStorage.setItem('currentUserId', usuarioId);
            getHome(usuarioId);
        });
    });

    document.querySelectorAll('.botao-adm').forEach(botao => {
        botao.addEventListener('click', (event) => {
            event.stopPropagation();
            
            const admId = document.getElementById('adm').value;
            localStorage.setItem('currentAdminId', admId);
            getHomeAdm(admId);
        });
    });
});



