import { buscarPedidos,
    atualizarStatus,
    buscarPedido
} from '/scripts/service/transacoes/pedidosService.js';

document.addEventListener('DOMContentLoaded', () => {
    const btnAtualizar = document.getElementById('atualizar');
    const statusSubmenu = document.createElement('div');
    let confirmationModal = null;
    
    const tra_id = btnAtualizar.dataset.traId; 
    const statusAtual = btnAtualizar.dataset.traStatus;
    const valorCompra = btnAtualizar.dataset.traValor;

    // Configurar submenu de status
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

    // Popular itens da venda no modal
    document.querySelectorAll('.table_div:last-of-type table tbody tr').forEach(item => {
        const cols = item.querySelectorAll('td');
        const itemElement = document.createElement('div');
        itemElement.className = 'item-modal';
        itemElement.innerHTML = `
            <p>${cols[0].textContent} - ${cols[2].textContent} unidade(s)</p>
            <p>${cols[1].textContent}</p>
        `;
        statusSubmenu.querySelector('.itens-venda-modal').appendChild(itemElement);
    });

    // Fechar modal
    const closeModal = () => {
        statusSubmenu.style.display = 'none';
        if(confirmationModal) confirmationModal.remove();
    };

    // Evento de abertura do submenu
    btnAtualizar.addEventListener('click', (e) => {
        e.stopPropagation();
        const opcoesContainer = statusSubmenu.querySelector('.opcoes-status');
        opcoesContainer.innerHTML = '';

        let opcoes = [];
        if (statusAtual === 'APROVADO') {
            opcoes = [
                { texto: 'Cancelar Compra', status: 'CANCELADO' },
                { texto: 'Confirmar Transporte', status: 'EM TRANSPORTE' }
            ];
        } else if (statusAtual === 'EM TRANSPORTE') {
            opcoes = [
                { texto: 'Cancelar Transporte', status: 'CANCELADO' },
                { texto: 'Confirmar Entrega', status: 'ENTREGUE' }
            ];
        } else if (statusAtual === 'TROCA SOLICITADA') {
            opcoes = [
                { texto: 'Recusar Troca', status: 'TROCA RECUSADA' },
                { texto: 'Aprovar Troca', status: 'TROCA APROVADA' }
            ];
        } else if (statusAtual === 'TROCA APROVADA') {
            opcoes = [
                { texto: 'Cancelar', status: '' },
                { texto: 'Confirmar Troca', status: 'TROCA CONCLUIDA' }
            ];
        } else if (statusAtual === 'DEVOLUCAO SOLICITADA') {
            opcoes = [
                { texto: 'Recusar Devolução', status: 'DEVOLUCAO RECUSADA' },
                { texto: 'Aprovar Devolução', status: 'DEVOLUCAO APROVADA' }
            ];
        } else if (statusAtual === 'DEVOLUCAO APROVADA') {
            opcoes = [
                { texto: 'Cancelar', status: '' },
                { texto: 'Confirmar Devolução', status: 'DEVOLUCAO CONCLUIDA' }
            ];
        } else {
            opcoesContainer.innerHTML = '<p class="mensagem-status">O status não pode ser modificado</p>';
        }

        opcoes.forEach(({ texto, status }) => {
            const btn = document.createElement('button');
            btn.className = 'btn-opcao';
            btn.textContent = texto;
            btn.onclick = async () => {
                const result = await atualizarStatus(tra_id, status);
                if (result.success) {
                    statusSubmenu.style.display = 'none';
                    showConfirmationModal(status);
                } else {
                    alert(result.error || 'Erro ao atualizar status');
                }
            };
            opcoesContainer.appendChild(btn);
        });

        statusSubmenu.style.display = 'flex';
    });

    // Modal de confirmação
    const showConfirmationModal = (novoStatus) => {
        confirmationModal = document.createElement('div');
        confirmationModal.className = 'confirmation-modal';
        confirmationModal.innerHTML = `
            <div class="confirmation-content">
                <h3>Operação realizada com sucesso!</h3>
                <p>Status atualizado para: ${novoStatus.replace(/_/g, ' ')}</p>
                <button id="btn-voltar-pedidos">Voltar para Pedidos</button>
            </div>
        `;
        document.body.appendChild(confirmationModal);

        document.getElementById('btn-voltar-pedidos').addEventListener('click', () => {
            buscarPedidos();
        });

        alert("Operação Concluída!");

        setTimeout(() => {
            buscarPedido(tra_id);
        }, 1500);
    };

    // Fechar modais ao clicar fora
    document.addEventListener('click', (e) => {
        if (!statusSubmenu.contains(e.target)) closeModal();
        if (confirmationModal && !confirmationModal.contains(e.target)) {
            confirmationModal.remove();
        }
    });

    // Botão de fechar
    statusSubmenu.querySelector('.close-modal').addEventListener('click', closeModal);
});