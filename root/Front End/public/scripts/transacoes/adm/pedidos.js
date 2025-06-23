import { filterPedido } from "../../service/transacoes/pedidosService";

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
        outputValor.textContent = `R$ ${parseFloat(e.target.value)}`;
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
            const response = await filterPedido(filtros);
            atualizarTabelaPedidos(response);
        } catch (error) {
            console.error('Erro ao filtrar pedidos:', error);
        }
    });

    // Atualizar tabela
    function atualizarTabelaPedidos(pedidos) {
        const tbody = document.querySelector('tbody');
        tbody.innerHTML = '';
    
        pedidos.forEach(pedido => {
            const row = `
                <tr>
                    <td></td>
                    <td>${pedido.usuario?.usr_nome || 'N/A'}</td>
                    <td>R$ ${pedido.tra_valor}</td>
                    <td>${new Date(pedido.tra_data).toLocaleDateString()}</td>
                    <td class="status-${pedido.tra_status.toLowerCase().replace(/ /g, '-')}">
                        ${pedido.tra_status}
                    </td>
                    <td>
                        <div class="botoes_resultado">
                            <a href="/pedidos-adm/detalhes?tra_id=${pedido.tra_id}" class="alterar">
                                Ver Mais
                            </a>
                        </div>
                    </td>
                </tr>`;
            tbody.insertAdjacentHTML('beforeend', row);
        });
    }
});