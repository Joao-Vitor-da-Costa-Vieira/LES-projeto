import { getHome } from "/scripts/service/telaInicialService.js";
import { pesquisarLivroService } from "/scripts/service/livroService.js";
import { getCarrinho } from "/scripts/service/transacoes/carrinhoService.js"

async function verificarNotificacoes(usuarioId) {
    try {
        const response = await fetch(`/notificacoes?usr_id=${usuarioId}`);
        const notificacoes = await response.json();
        
        const iconeNotificacao = document.querySelector('.notificacao-icone');
        iconeNotificacao.hidden = notificacoes.length === 0;
        
        return notificacoes;
    } catch (error) {
        console.error('Erro ao verificar notificações:', error);
        return [];
    }
}

async function apagarNotificacaoHandler(ntf_id, usuarioId, redirect = false) {
    try {
        const response = await fetch(`/notificacoes/${ntf_id}`, { method: 'DELETE' });
        
        if (response.ok) {
            const notificacoes = await verificarNotificacoes(usuarioId);
            atualizarSubmenu(notificacoes, usuarioId);
            
            if (redirect) {
                const notificacao = notificacoes.find(n => n.ntf_id === ntf_id);
                if (notificacao) {
                    window.location.href = `/pagamento/detalhes?tra_id=${notificacao.transacoes_tra_id}`;
                }
            }
        }
    } catch (error) {
        console.error('Erro ao apagar notificação:', error);
    }
}

function atualizarSubmenu(notificacoes, usuarioId) {
    const lista = document.querySelector('.notificacoes-lista');
    const submenu = document.querySelector('.notificacao-submenu');
    const iconeNotificacao = document.querySelector('.notificacao-icone');

    lista.innerHTML = '';

    iconeNotificacao.hidden = notificacoes.length === 0;

    notificacoes.forEach(notificacao => {
        const item = document.createElement('div');
        item.className = 'notificacao-item';
        item.innerHTML = `
            <div class="notificacao-texto">${notificacao.ntf_mensagem}</div>
            <button class="notificacao-excluir">✕</button>
        `;

        item.querySelector('.notificacao-texto').addEventListener('click', async () => {
            window.location.href = `/pagamento/detalhes?tra_id=${notificacao.transacoes_tra_id}`;
    
            setTimeout(async () => {
                await apagarNotificacaoHandler(notificacao.ntf_id, usuarioId);
            }, 300);
        });

        item.querySelector('.notificacao-excluir').addEventListener('click', (e) => {
            e.stopPropagation();
            apagarNotificacaoHandler(notificacao.ntf_id, usuarioId);
        });

        lista.appendChild(item);
    });

    if (notificacoes.length === 0) {
        submenu.classList.remove('visivel');
    } else{
        submenu.classList.add('visivel');
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    document.querySelectorAll('.home-link').forEach(botao => {
        botao.addEventListener('click', (event) => {
            event.stopPropagation();
            console.log("Botão clicado!");
            getHome('1');
        });
    });

    const userDataElement = document.getElementById('user-data');
    const usuarioId = userDataElement.getAttribute('data-user-id');
    const iconeNotificacao = document.querySelector('.notificacao-icone');
    const submenu = document.querySelector('.notificacao-submenu');

    try {
        const notificacoes = await verificarNotificacoes(usuarioId);
        atualizarSubmenu(notificacoes, usuarioId);
        submenu.classList.remove('visivel'); 
    } catch (error) {
        console.error('Erro ao carregar notificações:', error);
    }

    iconeNotificacao.addEventListener('click', (e) => {
        e.stopPropagation();
        
        if (!iconeNotificacao.hidden) {
            submenu.classList.toggle('visivel'); 
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.notificacao-container')) {
            submenu.classList.remove('visivel');
        }
    });

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


