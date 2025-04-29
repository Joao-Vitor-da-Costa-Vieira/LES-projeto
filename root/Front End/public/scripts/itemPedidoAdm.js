import { atualizarStatus } from '/scripts/service/pedidosService.js';

document.addEventListener('DOMContentLoaded', () => {
    const btnAtualizar = document.getElementById('atualizar');
    const statusSubmenu = document.createElement('div');
    
    const tra_id = btnAtualizar.dataset.traId; 
    const statusAtual = btnAtualizar.dataset.traStatus;
    const valorCompra = btnAtualizar.dataset.traValor;
    
    // Configurar o submenu
    statusSubmenu.className = 'status-modal';
    statusSubmenu.innerHTML = `
        <div class="modal-content">
            <button class="close-modal">&times;</button>
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

    const closeBtn = statusSubmenu.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        statusSubmenu.style.display = 'none';
    });
    
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
    
        let opcoes = [];

        if (statusAtual === 'APROVADO') {
            opcoes = [
                { texto: 'Cancelar Compra', status: 'CANCELADO' },
                { texto: 'Confirmar Transporte', status: 'EM_TRANSPORTE' }
            ];
        } else if (statusAtual === 'EM_TRANSPORTE') {
            opcoes = [
                { texto: 'Cancelar Transporte', status: 'CANCELADO' },
                { texto: 'Confirmar Entrega', status: 'ENTREGUE' }
            ];
        } else if (statusAtual === 'TROCA_SOLICITADA') {
            opcoes = [
                { texto: 'Cancelar', status: 'CANCELADO' },
                { texto: 'Recusar Troca', status: 'TROCA_RECUSADA' },
                { texto: 'Aprovar Troca', status: 'TROCA_APROVADA' }
            ];
        } else if (statusAtual === 'TROCA_APROVADA') {
            opcoes = [
                { texto: 'Cancelar', status: 'CANCELADO' },
                { texto: 'Confirmar Troca', status: 'TROCA_CONCLUIDA' }
            ];
        } else if (statusAtual === 'DEVOLUCAO_SOLICITADA') {
            opcoes = [
                { texto: 'Cancelar', status: 'CANCELADO' },
                { texto: 'Recusar Devolução', status: 'DEVOLUCAO_RECUSADA' },
                { texto: 'Aprovar Devolução', status: 'DEVOLUCAO_APROVADA' }
            ];
        } else if (statusAtual === 'DEVOLUCAO_APROVADA') {
            opcoes = [
                { texto: 'Cancelar', status: 'CANCELADO' },
                { texto: 'Confirmar Devolução', status: 'DEVOLUCAO_CONCLUIDA' }
            ];
        } else {
            opcoesContainer.innerHTML = '<p>O status não pode ser modificado</p>';
        }

        opcoes.forEach(({ texto, status }) => {
            const btn = document.createElement('button');
            btn.className = 'btn-opcao';
            btn.textContent = texto;
            btn.onclick = async () => {
                const result = await atualizarStatus(tra_id, status);
                if (result.success) location.reload();
            };
            opcoesContainer.appendChild(btn);
        });
    
        statusSubmenu.style.display = 'flex';
    });

    // Fechar modal
    statusSubmenu.addEventListener('click', (e) => {
        if (e.target === statusSubmenu) {
            statusSubmenu.style.display = 'none';
        }
    });
});