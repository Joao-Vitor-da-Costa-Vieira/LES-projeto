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
    
        let opcoes = [];
        let mensagemStatus = '';
        
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
            mensagemStatus = 'O status dessa operação não pode ser modificado';
        }
    
        if (mensagemStatus) {
            const mensagemElement = document.createElement('p');
            mensagemElement.className = 'mensagem-status';
            mensagemElement.textContent = mensagemStatus;
            opcoesContainer.appendChild(mensagemElement);
        } else {
            opcoes.forEach(opcao => {
                const btn = document.createElement('button');
                btn.className = 'btn-opcao';
                btn.textContent = opcao;
                btn.onclick = async () => {
                    const novoStatus = converterTextoParaStatus(opcao);
                    const result = await atualizarStatus(tra_id, novoStatus);
                    if (result.success) location.reload();
                };
                opcoesContainer.appendChild(btn);
            });
        }
    
        statusSubmenu.style.display = 'flex';
    });
    
    const converterTextoParaStatus = (texto) => {
        return texto.toUpperCase().replace(/ /g, '_');
    };

    // Fechar modal
    statusSubmenu.addEventListener('click', (e) => {
        if (e.target === statusSubmenu) {
            statusSubmenu.style.display = 'none';
        }
    });
});