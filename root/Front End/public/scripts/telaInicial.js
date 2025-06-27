import {getHome, getHomeAdm} from "/scripts/service/telaInicialService.js";

document.addEventListener('DOMContentLoaded', () => {

    localStorage.removeItem('currentUserId');
    localStorage.removeItem('currentUserName');
    localStorage.removeItem('currentAdminId');
    localStorage.removeItem('currentAdminName');
    
    document.querySelectorAll('.botao-usuario').forEach(botao => {
        botao.addEventListener('click', (event) => {
            event.stopPropagation();
            
            const selectUser = document.getElementById('usuario');
            const usuarioId = selectUser.value;
            const usuarioNome = selectUser.options[selectUser.selectedIndex].text.split(', ')[1];

            localStorage.setItem('currentUserId', usuarioId);
            localStorage.setItem('currentUserName', usuarioNome);

            getHome(usuarioId);
        });
    });

    document.querySelectorAll('.botao-adm').forEach(botao => {
        botao.addEventListener('click', (event) => {
            event.stopPropagation();
            
            const selectAdm = document.getElementById('adm');
            const admId = selectAdm.value;
            const admNome = selectAdm.options[selectAdm.selectedIndex].text.split(', ')[1];

            localStorage.setItem('currentAdmId', admId);
            localStorage.setItem('currentAdmName', admNome);

            getHomeAdm(admId);
        });
    });
});



