import { confirmarDevolucao } from "../../service/transacoes/devolucoesService";

const tabelaBody = document.querySelector('#tabela-carrinho tbody');
let subtotalValor = document.getElementById('subtotal-valor');

// Função para calcular subtotal
function calcularSubtotal() {
    let subtotal = 0;
    
    document.querySelectorAll('#tabela-carrinho tbody tr').forEach(row => {
        if (row.dataset.lvrId) {
            const preco = parseFloat(row.querySelector('td:nth-child(2)').textContent.replace('R$ ', ''));
            const qtd = parseInt(row.querySelector('.qtd-atual').textContent);
            
            subtotal += preco * qtd;
        }
    });
    
    subtotalValor.textContent = subtotal.toFixed(2);
}

// Função para criar submenu
function criarSubmenu(botaoAtualizar, qtdMax, quantidadeAtual) {
    const submenu = document.createElement('div');
    submenu.classList.add('atualizar_submenu');
    
    submenu.innerHTML = `
    <div class="linha_centralizada">
        <p class="confirmar-atualizacao">Alterar quantidade para troca?</p>
    </div>
    <div class="linha_centralizada">
        <button class="submenu-botao-atualizacao" type="button"><</button>
        <input class="numero_input" type="number" 
               value="${quantidadeAtual}" 
               min="1" 
               max="${qtdMax}">
        <button class="submenu-botao-atualizacao" type="button">></button>
    </div>
    <button class="submenu-atualizar-produto" type="button">Confirmar</button>
    `;

    // Posicionamento relativo ao botão
    const rect = botaoAtualizar.getBoundingClientRect();
    submenu.style.position = 'absolute';
    submenu.style.left = `${rect.left}px`;
    submenu.style.top = `${rect.bottom + 5}px`;
    submenu.style.zIndex = '1000';

    return submenu;
}

// Evento de clique na tabela
tabelaBody.addEventListener('click', function(event) {
    const botaoAtualizar = event.target.closest('.atualizar');
    
    if (botaoAtualizar) {
        event.preventDefault();
        event.stopPropagation();

        const row = botaoAtualizar.closest('tr');
        const qtdMax = parseInt(row.querySelector('.qtd-max').textContent);
        
        // Remover submenus existentes
        document.querySelectorAll('.atualizar_submenu').forEach(menu => menu.remove());

        // Criar novo submenu
        const quantidadeAtual = parseInt(row.querySelector('.qtd-atual').textContent);
        const submenu = criarSubmenu(botaoAtualizar, qtdMax, quantidadeAtual);
        
        document.body.appendChild(submenu);

        // Elementos do submenu
        const input = submenu.querySelector('.numero_input');
        const btnDecrease = submenu.querySelector('.submenu-botao-atualizacao:first-child');
        const btnIncrease = submenu.querySelector('.submenu-botao-atualizacao:last-child');
        const btnConfirmar = submenu.querySelector('.submenu-atualizar-produto');

        // Eventos dos controles
        const atualizarValor = (novoValor) => {
            input.value = Math.min(Math.max(novoValor, 1), qtdMax);
        };

        btnDecrease.addEventListener('click', (e) => {
            e.stopPropagation();
            atualizarValor(parseInt(input.value) - 1);
        });

        btnIncrease.addEventListener('click', (e) => {
            e.stopPropagation();
            atualizarValor(parseInt(input.value) + 1);
        });

        input.addEventListener('input', (e) => {
            e.stopPropagation();
            atualizarValor(parseInt(e.target.value) || 1);
        });

        btnConfirmar.addEventListener('click', (e) => {
            e.stopPropagation();
            row.querySelector('.qtd-atual').textContent = input.value;
            submenu.remove();
            calcularSubtotal();
        });

        // Prevenir fechamento ao clicar no submenu
        submenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
});

// Fechar submenu ao clicar fora
document.addEventListener('click', (e) => {
    if (!e.target.closest('.atualizar_submenu') && !e.target.closest('.atualizar')) {
        document.querySelectorAll('.atualizar_submenu').forEach(menu => menu.remove());
    }
});

// Evento de envio do formulário
document.getElementById('devolver')?.addEventListener('click', async() => {
    e.preventDefault();
    
    const itensTroca = [];
    document.querySelectorAll('#tabela-carrinho tbody tr[data-lvr-id]').forEach(row => {
        itensTroca.push({
            lvr_id: row.dataset.lvrId,
            quantidade: parseInt(row.querySelector('.qtd-atual').textContent)
        });
    });

    const traDataElement = document.getElementById('tra-data');
    const tra_id = traDataElement ? JSON.parse(traDataElement.textContent) : [];
    
    const subtotal = parseFloat(document.getElementById('subtotal-valor').textContent);

    const endDataElement = document.getElementById('end-data');
    const end_id = endDataElement ? JSON.parse(endDataElement.textContent) : [];
    const usr_id = document.getElementById('user-data').dataset.userId;

    const res = await confirmarDevolucao(usr_id, itensTroca, subtotal, tra_id, end_id);
    return res.json();
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    calcularSubtotal();
    
    // Adicionar tooltip de quantidade máxima
    document.querySelectorAll('.qtd-max').forEach(element => {
        element.title = `Quantidade máxima disponível: ${element.textContent}`;
    });
});