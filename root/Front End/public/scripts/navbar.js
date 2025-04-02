import {getHome} from "/scripts/service/telaInicialService.js";
import { pesquisarLivroService } from "/scripts/service/livroService.js";

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
        
        if (termoPesquisa) {
            try {
                await pesquisarLivroService(titulo, usuarioId);
                console.log('Dados enviados para o serviço com sucesso');
            } catch (error) {
                console.error('Erro ao enviar dados para o serviço:', error);
                alert('Ocorreu um erro ao enviar a pesquisa. Por favor, tente novamente.');
            }
        } else {
            alert('Por favor, digite algo para pesquisar.');
        }
    });
});


