import { filtroLivroService } from "/scripts/service/livroService.js";

const value = document.querySelector("#valor");
const slider = document.querySelector("#preco");
const cifra = document.querySelector("#cifra");
const pesquisaBotao = document.querySelector("#pesquisa-botao");
const tabelaBody = document.querySelector("tbody");

// Configuração do slider de preço
value.textContent = slider.value === "501" ? "Nulo" : slider.value;

slider.addEventListener("input", (event) => {
    if (event.target.value === "501") {
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
            <td>R$ ${livro.lvr_custo}</td>
            <td>
                <div class="botoes_resultado">
                    <a class="atualizar" href="/livros/${livro.lvr_id}">Detalhes</a>
                </div>
            </td>
        `;
        tabelaBody.appendChild(row);
    });
}

// Função para coletar os filtros do formulário
function coletarFiltros() {
    const precoMax = slider.value === "501" ? null : slider.value;
    
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