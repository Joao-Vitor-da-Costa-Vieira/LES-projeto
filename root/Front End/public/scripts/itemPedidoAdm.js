import { atualizarStatus } from '/scripts/service/pedidosService.js';

document.addEventListener('DOMContentLoaded', () => {
    const btnAtualizar = document.getElementById('atualizar');
    const statusSubmenu = document.createElement('div');
    
    // Extrair dados do HTML existente
    const tra_id = document.querySelector('.titulo').textContent.match(/#(\d+)/)[1];
    const statusAtual = document.querySelector('table tr td:nth-child(4)').textContent.trim();
    const valorCompra = document.querySelector('table tr td:nth-child(3)').textContent.trim();
    
    // Configurar o submenu
    statusSubmenu.className = 'status-modal';
    statusSubmenu.innerHTML = `
        <div class="modal-content">
            <h3>O que deseja fazer?</h3>
            <div class="status-info">
                <p>Status Atual: ${statusAtual}</p>
                <p>Valor Total: ${valorCompra}</p>
            </div>
            <div class="itens-venda-modal"></div>
            <div class="opcoes-status"></div>
        </div>
    `;
    document.body.appendChild(statusSubmenu);

    // Popular itens da venda
    const itensTable = document.querySelectorAll('.table_div:last-of-type table tbody tr');
    const itensContainer = statusSubmenu.querySelector('.itens-venda-modal');
    
    itensTable.forEach(item => {
        const cols = item.querySelectorAll('td');
        const itemElement = document.createElement('div');
        itemElement.className = 'item-modal';
        itemElement.innerHTML = `
            <p>${cols[0].textContent} - ${cols[2].textContent} unidade(s)</p>
            <p>${cols[1].textContent}</p>
        `;
        itensContainer.appendChild(itemElement);
    });

    btnAtualizar.addEventListener('click', (e) => {
        e.stopPropagation();
        const opcoesContainer = statusSubmenu.querySelector('.opcoes-status');
        opcoesContainer.innerHTML = '';

        // Determinar opções baseadas no status
        let opcoes = [];
        
        if (statusAtual === 'APROVADO') {
            opcoes = ['Cancelar Compra', 'Confirmar Transporte'];
        } else if (statusAtual === 'EM TRANSPORTE') {
            opcoes = ['Cancelar Transporte', 'Confirmar Entrega'];
        } else if (statusAtual === 'TROCA SOLICITADA') {
            opcoes = ['Cancelar', 'Recusar Troca', 'Aprovar Troca'];
        } else if (statusAtual === 'TROCA APROVADA') {
            opcoes = ['Cancelar', 'Confirmar Troca'];
        } else if (statusAtual === 'DEVOLUÇÃO SOLICITADA') {
            opcoes = ['Cancelar', 'Recusar Devolução', 'Aprovar Devolução'];
        } else if (statusAtual === 'DEVOLUÇÃO APROVADA') {
            opcoes = ['Cancelar', 'Confirmar Devolução'];
        } else {
            opcoesContainer.innerHTML = '<p>O status não pode ser modificado</p>';
            return;
        }

        // Criar botões de opções
        opcoes.forEach(opcao => {
            const btn = document.createElement('button');
            btn.className = 'btn-opcao';
            btn.textContent = opcao;
            btn.onclick = async () => {
                const result = await atualizarStatus(tra_id, opcao.toUpperCase().replace(' ', '_'));
                if (result.success) {
                    alert('Status atualizado!');
                    location.reload();
                }
            };
            opcoesContainer.appendChild(btn);
        });

        // Mostrar modal centralizado
        statusSubmenu.style.display = 'flex';
    });

    // Fechar modal
    statusSubmenu.addEventListener('click', (e) => {
        if (e.target === statusSubmenu) {
            statusSubmenu.style.display = 'none';
        }
    });
});