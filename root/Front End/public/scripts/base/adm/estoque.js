import { filtroLivroService } from "/scripts/service/livroService.js";

const pesquisaBotao = document.querySelector("#pesquisa-botao");
const tabelaBody = document.querySelector("tbody");

// Função para coletar os filtros do formulário
function coletarFiltros() {
    
    return {
        isbn: document.querySelector('.filtro-pesquisa-numero-isbn')?.value || null,
        codigoBarras: document.querySelector('.filtro-pesquisa-numero-codigo')?.value || null
    };
}

// Função para atualizar a tabela com os resultados
function atualizarTabela(livros) {
    tabelaBody.innerHTML = '';

    if (livros.length === 0) {
        tabelaBody.innerHTML = '<tr><td colspan="6">Nenhum livro encontrado</td></tr>';
        return;
    }

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${livros.lvr_titulo}</td>
        <td>R$ ${livros.lvr_codigo_de_barras}</td>
        <td>R$ ${livros.lvr_isbn}</td>
        <td>${livros.atr_nome || 'N/A'}</td>
        <td>${livros.edi_nome || 'N/A'}</td>
        <td>${livros.lvr_qtd_estoque}</td>
        <td>R$ ${livros.lvr_custo}</td>
    `;
    tabelaBody.appendChild(row);
}

pesquisaBotao.addEventListener('click', async (e) => {
    e.preventDefault();
    
    try {
        const filtros = coletarFiltros();
        const livros = await filtroLivroService(filtros);
        atualizarTabela(livros);
    } catch (error) {
        console.error('Erro ao pesquisar livros:', error);
        tabelaBody.innerHTML = '<tr><td colspan="6">Erro ao carregar o livro</td></tr>';
    }
});

