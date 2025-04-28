document.addEventListener('DOMContentLoaded', () => {
    const filtroContainer = document.querySelector('.filtros-container');
    const toggleButton = document.querySelector('.botao-mais-filtro');
    const aplicarFiltroBtn = document.querySelector('.confirmar');
    const rangeValor = document.querySelector('#valorMaximo');
    const outputValor = document.querySelector('#valorExibido');

    // Toggle dos filtros
    toggleButton.addEventListener('click', () => {
        filtroContainer.classList.toggle('hidden');
        toggleButton.textContent = filtroContainer.classList.contains('hidden') 
            ? 'Mostrar Filtros' 
            : 'Ocultar Filtros';
    });

    // Atualizar valor do range
    rangeValor.addEventListener('input', (e) => {
        outputValor.textContent = `R$ ${parseFloat(e.target.value).toFixed(2).replace('.', ',')}`;
    });

    // Coletar filtros
    function coletarFiltros() {
        return {
            status: document.querySelector('#status').value,
            valorMaximo: parseFloat(rangeValor.value),
            dataInicio: document.querySelector('#dataInicio').value,
            dataFim: document.querySelector('#dataFim').value,
            nomeUsuario: document.querySelector('#nomeUsuario').value.trim()
        };
    }

    // Aplicar filtros
    aplicarFiltroBtn.addEventListener('click', async () => {
        try {
            const filtros = coletarFiltros();
            const response = await filterPedidoService(filtros);
            atualizarTabelaPedidos(response);
        } catch (error) {
            console.error('Erro ao filtrar pedidos:', error);
        }
    });
});

// Service para filtrar pedidos
export async function filterPedidoService(filtros) {
    try {
        const queryParams = new URLSearchParams();
        
        Object.entries(filtros).forEach(([key, value]) => {
            if (value !== '' && value !== null && value !== undefined) {
                queryParams.append(key, value);
            }
        });

        const response = await fetch(`/api/pedidos/filtrar?${queryParams.toString()}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) throw new Error('Erro na requisição');
        return await response.json();
    } catch (err) {
        console.error('Erro no filterPedidoService:', err);
        throw err;
    }
}

// Atualizar tabela
function atualizarTabelaPedidos(pedidos) {
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';

    if (pedidos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">Nenhum pedido encontrado</td></tr>';
        return;
    }

    pedidos.forEach(pedido => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td></td>
            <td>${pedido.usuario.usr_nome}</td>
            <td>R$ ${pedido.tra_valor.toFixed(2).replace('.', ',')}</td>
            <td>${new Date(pedido.tra_data).toLocaleDateString()}</td>
            <td class="status-${pedido.tra_status.toLowerCase().replace(/ /g, '-')}">
                ${pedido.tra_status}
            </td>
            <td>
                <a href="/pagamento-adm/detalhes?tra_id=${pedido.tra_id}" class="alterar">
                    Ver Mais
                </a>
            </td>
        `;
        tbody.appendChild(row);
    });
}