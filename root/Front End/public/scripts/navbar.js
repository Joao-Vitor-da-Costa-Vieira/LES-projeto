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

    const usuarioId = userDataElement ? userDataElement.dataset.userId : null;

    document.querySelectorAll('#botao-carrinho').forEach(botao => {
        botao.addEventListener('click', (event) => {
            event.stopPropagation();
            console.log("Botão clicado!");
            getCarrinho(usuarioId);
        });
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

