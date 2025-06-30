import { filtroLivroService, getLivroPagina } from "/scripts/service/livroService.js";
import { adicionarCarrinho } from "/scripts/service/transacoes/carrinhoService.js";
import { getCarrinho } from "/scripts/service/transacoes/carrinhoService.js";
import { getUserId } from "/scripts/service/usuario/usuarioService.js";

const value = document.querySelector("#valor");
const slider = document.querySelector("#preco");
const cifra = document.querySelector("#cifra");
const pesquisaBotao = document.querySelector("#pesquisa-botao");
const tabelaBody = document.querySelector("tbody");

// Configuração do slider de preço
value.textContent = slider.value === "301" ? "Nulo" : slider.value;

slider.addEventListener("input", (event) => {
    if (event.target.value === "301") {
        cifra.textContent = "";
        value.textContent = "Nulo";
    } else {
        cifra.textContent = "R$";
        value.textContent = event.target.value;
    }
});

// Toggle dos filtros avançados
document.addEventListener('DOMContentLoaded', function() {
    const botaoFiltro = document.querySelector('.botao-mais-filtro');
    const elementosOcultos = document.querySelectorAll('.hidden');

    botaoFiltro.addEventListener('click', function() {
        elementosOcultos.forEach(function(elemento) {
            elemento.classList.toggle('hidden');
        });

        botaoFiltro.textContent = botaoFiltro.textContent.includes('Mais') 
            ? 'Menos opções de filtragem' 
            : 'Mais opções de filtragem';
    });
});

// Função para atualizar a tabela com os resultados
function atualizarTabela(livros) {
    tabelaBody.innerHTML = '';

    if (livros.length === 0) {
        tabelaBody.innerHTML = '<tr><td colspan="6">Nenhum livro encontrado</td></tr>';
        return;
    }

    livros.forEach(livro => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${livro.lvr_titulo}</td>
            <td>${livro.atr_nome || 'N/A'}</td>
            <td>${livro.edi_nome || 'N/A'}</td>
            <td>${livro.lvr_ano}</td>
            <td>R$ ${livro.valor}</td>
            <td id ="livro-data" data-livro-id="${livro.lvr_id}">
                <div class="botoes_resultado">
                    <a class="atualizar" href="/livros/${livro.lvr_id}">Detalhes</a>
                    <button class="adicionar"> Adicionar </button>
                </div>
            </td>
        `;
        tabelaBody.appendChild(row);
    });
}

// Função para coletar os filtros do formulário
function coletarFiltros() {
    const precoMax = slider.value === "301" ? null : slider.value;
    
    return {
        titulo: document.querySelector('.filtro-pesquisa-input').value,
        precoMax,
        autor: document.querySelector('.filtro-pesquisa-input-autor')?.value || null,
        editora: document.querySelector('.filtro-pesquisa-input-editora')?.value || null,
        categoria: document.querySelector('.filtro-pesquisa-input-categoria')?.value || null,
        dataInicio: document.querySelector('#data_inicio')?.value || null,
        dataFinal: document.querySelector('#data_final')?.value || null,
        tamanho: document.querySelector('#tamanho')?.value || null,
        paginasMax: document.querySelector('.filtro-pesquisa-numero')?.value || null,
        isbn: document.querySelector('.filtro-pesquisa-numero-isbn')?.value || null,
        codigoBarras: document.querySelector('.filtro-pesquisa-numero-codigo')?.value || null
    };
}

pesquisaBotao.addEventListener('click', async (e) => {
    e.preventDefault();
    
    try {
        const filtros = coletarFiltros();
        const livros = await filtroLivroService(filtros);
        atualizarTabela(livros);
    } catch (error) {
        console.error('Erro ao pesquisar livros:', error);
        tabelaBody.innerHTML = '<tr><td colspan="6">Erro ao carregar os livros</td></tr>';
    }
});

// Event Delegation para os botões de adicionar
tabelaBody.addEventListener('click', async function(event) {
    const botaoAtualizar = event.target.closest('.atualizar');
    const livroDataElement = event.target.closest('td[data-livro-id]'); 
    const livroId = livroDataElement ? livroDataElement.dataset.livroId : null;
    const usr_id = await getUserId();

    if (botaoAtualizar) {
        event.preventDefault();
        event.stopPropagation();

        getLivroPagina(usr_id, livroId);
    }

    if (event.target.classList.contains('adicionar')) {
        const botao = event.target;
        event.stopPropagation();

        let submenuAtual = botao.querySelector('.atualizar_submenu');

        if (submenuAtual) {
            submenuAtual.remove();
            return;
        }

        document.querySelectorAll('.atualizar_submenu').forEach(menu => menu.remove());

        let submenu = document.createElement('div');
        submenu.classList.add('atualizar_submenu');

        submenu.innerHTML = `
        <div class="linha_centralizada">
            <p class="confirmar-adicao">Confirmar Adição?</p>
        </div>

        <div class="linha_centralizada">
            <button class="submenu-botao-adicao" type="button"><</button>
            <input class="numero_input" type="number" value="1" min="1">
            <button class="submenu-botao-adicao" type="button">></button>
        </div>

        <button class="submenu-adicionar-produto" type="button">Confirmar</button>
        `;

        botao.appendChild(submenu);

        const input = submenu.querySelector('.numero_input');
        const btnDecrease = submenu.querySelector('.submenu-botao-adicao:first-child');
        const btnIncrease = submenu.querySelector('.submenu-botao-adicao:last-child');
        const btnConfirmar = submenu.querySelector('.submenu-adicionar-produto');

        const stopProp = (e) => e.stopPropagation();

        btnDecrease.addEventListener('click', stopProp);
        btnIncrease.addEventListener('click', stopProp);
        input.addEventListener('click', stopProp);
        btnConfirmar.addEventListener('click', stopProp);

        // Controle dos valores
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

        btnConfirmar.addEventListener('click', async () => {
            const quantidade = parseInt(input.value);
            const lvr_id = botao.closest('[data-livro-id]').dataset.livroId;
            
            try {
                const response = await adicionarCarrinho(lvr_id, usr_id, quantidade);
                const resultado = await response.json();
                
                submenu.remove();
                
                const mensagemConfirmacao = document.createElement('div');
                mensagemConfirmacao.classList.add('confirmacao-overlay');
                
                mensagemConfirmacao.innerHTML = `
                    <div class="confirmacao-box">
                        <p>${resultado.message || 'Produto adicionado ao carrinho!'}</p>
                        <div class="confirmacao-botoes">
                            <button class="ver-carrinho">Ver Carrinho</button>
                            <button class="continuar-comprando">Continuar Comprando</button>
                        </div>
                    </div>
                `;
                
                document.body.appendChild(mensagemConfirmacao);
                
                mensagemConfirmacao.addEventListener('click', (e) => {
                    if (e.target === mensagemConfirmacao) {
                        mensagemConfirmacao.remove();
                    }
                });
                
                const btnVerCarrinho = mensagemConfirmacao.querySelector('.ver-carrinho');
                btnVerCarrinho.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    await getCarrinho(usr_id);
                    window.location.href = `/carrinho?usr_id=${usr_id}`;
                });
                
                const btnContinuar = mensagemConfirmacao.querySelector('.continuar-comprando');
                btnContinuar.addEventListener('click', (e) => {
                    e.stopPropagation();
                    mensagemConfirmacao.remove();
                });
        
            } catch (error) {
                console.error('Erro ao adicionar ao carrinho:', error);
                
                const mensagemErro = document.createElement('div');
                mensagemErro.classList.add('confirmacao-overlay');
                
                mensagemErro.innerHTML = `
                    <div class="confirmacao-box erro">
                        <p>${error.message}</p>
                        <button class="fechar-erro">OK</button>
                    </div>
                `;
                
                document.body.appendChild(mensagemErro);
                
                const btnFechar = mensagemErro.querySelector('.fechar-erro');
                btnFechar.addEventListener('click', () => {
                    mensagemErro.remove();
                });
                
                mensagemErro.addEventListener('click', (e) => {
                    if (e.target === mensagemErro) {
                        mensagemErro.remove();
                    }
                });
            }
        });
    }
});

// Removendo o submenu ao clicar fora da tela
document.addEventListener('click', () => {
    document.querySelectorAll('.atualizar_submenu').forEach(menu => menu.remove());
});