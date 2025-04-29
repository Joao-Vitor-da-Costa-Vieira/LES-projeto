document.addEventListener('DOMContentLoaded', () => {
    const btnAtualizar = document.getElementById('atualizar');
    const statusSubmenu = document.createElement('div');
    const tra_id = btnAtualizar.dataset.traId; 
    const statusAtual = btnAtualizar.dataset.traStatus;
    statusSubmenu.className = 'status-submenu';
    statusSubmenu.style.display = 'none';
    document.body.appendChild(statusSubmenu);

    // Função para criar opções do submenu
    const criarOpcoes = (opcoes) => {
        statusSubmenu.innerHTML = '';
        opcoes.forEach(opcao => {
            const btn = document.createElement('button');
            btn.className = 'submenu-option';
            btn.textContent = opcao.texto;
            btn.onclick = () => atualizarStatus(opcao.status);
            statusSubmenu.appendChild(btn);
        });
    };

    // Função para atualizar status
    const atualizarStatus = async (novoStatus) => {
        try {
            const response = await fetch(`/pedidos/${tra_id}/status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ novoStatus })
            });

            if (response.ok) {
                alert('Status atualizado com sucesso!');
                location.reload();
            } else {
                alert('Erro ao atualizar status');
            }
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    // Mostrar/ocultar submenu
    btnAtualizar.addEventListener('click', (e) => {
        e.stopPropagation();
        let opcoes = [];

        switch (statusAtual) {
            case 'APROVADO':
                opcoes = [
                    { texto: 'Cancelar Compra', status: 'CANCELADO' },
                    { texto: 'Confirmar Transporte', status: 'EM TRANSPORTE' }
                ];
                break;
            case 'EM TRANSPORTE':
                opcoes = [
                    { texto: 'Cancelar Transporte', status: 'CANCELADO' },
                    { texto: 'Confirmar Entrega', status: 'ENTREGUE' }
                ];
                break;
            case 'TROCA SOLICITADA':
                opcoes = [
                    { texto: 'Cancelar', status: 'CANCELADO' },
                    { texto: 'Recusar Troca', status: 'TROCA RECUSADA' },
                    { texto: 'Aprovar Troca', status: 'TROCA APROVADA' }
                ];
                break;
            case 'TROCA APROVADA':
                opcoes = [
                    { texto: 'Cancelar', status: 'CANCELADO' },
                    { texto: 'Confirmar Troca', status: 'TROCA CONCLUÍDA' }
                ];
                break;
            case 'DEVOLUÇÃO SOLICITADA':
                opcoes = [
                    { texto: 'Cancelar', status: 'CANCELADO' },
                    { texto: 'Recusar Devolução', status: 'DEVOLUÇÃO RECUSADA' },
                    { texto: 'Aprovar Devolução', status: 'DEVOLUÇÃO APROVADA' }
                ];
                break;
            case 'DEVOLUÇÃO APROVADA':
                opcoes = [
                    { texto: 'Cancelar', status: 'CANCELADO' },
                    { texto: 'Confirmar Devolução', status: 'DEVOLUÇÃO CONCLUÍDA' }
                ];
                break;
            default:
                alert('O status dessa operação não pode ser modificado');
                return;
        }

        criarOpcoes(opcoes);
        const rect = btnAtualizar.getBoundingClientRect();
        statusSubmenu.style.display = 'block';
        statusSubmenu.style.position = 'absolute';
        statusSubmenu.style.left = `${rect.left}px`;
        statusSubmenu.style.top = `${rect.bottom + 5}px`;
    });

    // Fechar submenu ao clicar fora
    document.addEventListener('click', (e) => {
        if (!statusSubmenu.contains(e.target)) {
            statusSubmenu.style.display = 'none';
        }
    });
});
