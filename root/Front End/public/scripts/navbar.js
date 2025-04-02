import {getHome} from "/scripts/service/telaInicialService.js";

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.home-link').forEach(botao => {
        botao.addEventListener('click', (event) => {
            event.stopPropagation();
            console.log("Botão clicado!");
            getHome('1');
        });
    });

    const botaoPesquisa = document.getElementById('navbarBotaoPesquisa');
    const pesquisaInput = document.getElementById('navbarInput');
    
    botaoPesquisa.addEventListener('click', function() {
        const titulo = pesquisaInput.value.trim();
        const usuarioId = '<%= Array.isArray(usuario) ? usuario[0]?.usr_id : usuario?.usr_id %>';
        
        if (titulo) {
            pesquisarLivroService(titulo, usuarioId);
        } else {
            alert('Por favor, digite um titulo para pesquisar.');
        }
    });
});


