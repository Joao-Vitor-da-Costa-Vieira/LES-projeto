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

    pedidos.forEach(pedido => {
        const row = `
            <tr>
                <td>${pedido.id}</td>
                <td>${pedido.usuario}</td>
                <td>R$ ${pedido.valor}</td>
                <td>${new Date(pedido.data).toLocaleDateString()}</td>
                <td class="status-${pedido.status.toLowerCase().replace(/ /g, '-')}">
                    ${pedido.status}
                </td>
                <td>
                    <a href="/pedidos/${pedido.id}" class="ver-detalhes">Ver Detalhes</a>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}