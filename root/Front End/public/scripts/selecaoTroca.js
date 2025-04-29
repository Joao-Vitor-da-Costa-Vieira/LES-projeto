const tabelaBody = document.querySelector('#tabela-carrinho tbody');
let subtotalValor = document.getElementById('subtotal-valor');

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

tabelaBody.addEventListener('click', function(event) {
    const botaoAtualizar = event.target.closest('.atualizar');
    
    if (botaoAtualizar) {
        event.preventDefault();
        event.stopPropagation();

        const row = botaoAtualizar.closest('tr');
        const qtdMax = parseInt(row.querySelector('.qtd-max').textContent);
        let submenuAtual = botaoAtualizar.querySelector('.atualizar_submenu');

        if (submenuAtual) {
            submenuAtual.remove();
            return;
        }

        document.querySelectorAll('.atualizar_submenu').forEach(menu => menu.remove());

        let submenu = document.createElement('div');
        submenu.classList.add('atualizar_submenu');
        
        const quantidadeAtual = parseInt(row.querySelector('.qtd-atual').textContent);
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

        botaoAtualizar.appendChild(submenu);

        const input = submenu.querySelector('.numero_input');
        const btnDecrease = submenu.querySelector('.submenu-botao-atualizacao:first-child');
        const btnIncrease = submenu.querySelector('.submenu-botao-atualizacao:last-child');
        const btnConfirmar = submenu.querySelector('.submenu-atualizar-produto');

        btnDecrease.addEventListener('click', () => {
            let value = parseInt(input.value);
            if (value > 1) {
                input.value = value - 1;
            }
        });

        btnIncrease.addEventListener('click', () => {
            let value = parseInt(input.value);
            input.value = value + 1;
        });

        input.addEventListener('change', () => {
            if (parseInt(input.value) < 1 || isNaN(parseInt(input.value))) {
                input.value = 1;
            }
        });

        btnConfirmar.addEventListener('click', () => {
            const novaQtd = parseInt(input.value);
            row.querySelector('.qtd-atual').textContent = novaQtd;
            submenu.remove();
            calcularSubtotal(); 
        });
    }
});

// Remover o submenu ao clicar fora
document.addEventListener('click', () => {
    document.querySelectorAll('.atualizar_submenu').forEach(menu => menu.remove());
});

// Atualizar o evento do botão Confirmar
document.getElementById('comprar').addEventListener('click', function() {
    const itensTroca = [];
    
    document.querySelectorAll('#tabela-carrinho tbody tr[data-lvr-id]').forEach(row => {
        itensTroca.push({
            lvr_id: row.dataset.lvrId,
            quantidade: parseInt(row.querySelector('.qtd-atual').textContent)
        });
    });

    fetch('/trocas/confirmar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            usr_id: document.getElementById('user-data').dataset.userId,
            itens: itensTroca
        })
    })
    .then(response => response.json())
    .catch(error => console.error('Erro:', error));
});

// Inicializar subtotal
document.addEventListener('DOMContentLoaded', calcularSubtotal);