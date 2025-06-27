import { filterPedido } from "/scripts/service/transacoes/pedidosService.js";
import { getAdmId } from "/scripts/service/usuario/admService.js";

document.addEventListener('DOMContentLoaded', async () => {
    const filtroContainer = document.querySelector('.filtros-container');
    const toggleButton = document.querySelector('.botao-mais-filtro');
    const aplicarFiltroBtn = document.querySelector('.confirmar');
    const rangeValor = document.querySelector('#valorMaximo');
    const outputValor = document.querySelector('#valorExibido');
    const tabelaPedidos = document.querySelector('#tabela-pedidos');
    const admId = await getAdmId();

    tabelaPedidos.addEventListener('click', function(event) {
        const botaoAtualizar = event.target.closest('.alterar');
        
        if(botaoAtualizar) {
        // Encontra a linha da tabela (tr) que contém o botão clicado
        const linha = botaoAtualizar.closest('tr');
        if (linha) {
            // Encontra a célula que contém o data attribute
            const celula = linha.querySelector('td[data-tra-id]');
            if (celula) {
                const traId = celula.getAttribute('data-tra-id');
                window.location.href = `/pedidos-adm/detalhes?tra_id=${traId}&adm_id=${admId}`;
            }
        }
    }
    });

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
                    <td id="tra-data" data-tra-id="${pedido.tra_id}"></td>
                    <td>${pedido.usuario?.usr_nome || 'N/A'}</td>
                    <td>R$ ${pedido.tra_valor}</td>
                    <td>${new Date(pedido.tra_data).toLocaleDateString()}</td>
                    <td class="status-${pedido.tra_status.toLowerCase().replace(/ /g, '-')}">
                        ${pedido.tra_status}
                    </td>
                    <td>
                        <div class="botoes_resultado">
                            <a class="alterar">
                                Ver Mais
                            </a>
                        </div>
                    </td>
                </tr>`;
            tbody.insertAdjacentHTML('beforeend', row);
        });
    }
});