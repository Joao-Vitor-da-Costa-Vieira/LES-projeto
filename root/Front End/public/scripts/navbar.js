import { getHome } from "/scripts/service/telaInicialService.js";
import { pesquisarLivroService } from "/scripts/service/livroService.js";
import { getCarrinho } from "/scripts/service/carrinhoService.js"

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.home-link').forEach(botao => {
        botao.addEventListener('click', (event) => {
            event.stopPropagation();
            console.log("Botão clicado!");
            getHome('1');
        });
    });

    const userDataElement = document.getElementById('user-data');
    const usuarioId = userDataElement.getAttribute('data-user-id');

    document.querySelectorAll('#botao-carrinho').forEach(botao => {
        botao.addEventListener('click', (event) => {
            event.stopPropagation();
            console.log("Botão clicado!");
            getCarrinho(usuarioId);
        });
    });

    document.querySelectorAll('.nav-botao button').forEach(btn => {
        if (btn.textContent.trim() === 'Histórico') {
            btn.addEventListener('click', (event) => {
                event.stopPropagation();
                window.location.href = `/pagamento/historico?usr_id=${usuarioId}`;
            });
        }
    });

    const botaoPesquisa = document.getElementById('navbarBotaoPesquisa');
    const pesquisaInput = document.getElementById('navbarInput');
    
    
    botaoPesquisa.addEventListener('click', async () => {
        const titulo = pesquisaInput.value.trim();
        
        if (titulo) {
            try {
                await pesquisarLivroService(titulo, usuarioId);
            } catch (error) {
                console.error('Erro ao pesquisar:', error);
                alert('Erro ao pesquisar. Tente novamente.');
            }
        } else {
            alert('Digite um título para pesquisar.');
        }
    });
});

