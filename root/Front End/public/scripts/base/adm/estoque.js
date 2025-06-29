import { filtroLivroService } from "/scripts/service/livroService.js";

const pesquisaBotao = document.querySelector("#pesquisa-botao");
const tabelaBody = document.querySelector("tbody");
const elementosOcultos = document.querySelectorAll('.hidden');

let hiddenVerificador = 0;

// Função para coletar os filtros do formulário
function coletarFiltros() {
    
    return {
        isbn: document.querySelector('.filtro-pesquisa-numero-isbn')?.value || null,
        codigoBarras: document.querySelector('.filtro-pesquisa-numero-codigo')?.value || null
    };
}

// Função para atualizar a tabela com os resultados
function atualizarTabela(livros) {

    if(hiddenVerificador === 0){
        elementosOcultos.forEach(function(elemento) {
            elemento.classList.remove('hidden');
        });

        hiddenVerificador = 1;
    }

    tabelaBody.innerHTML = '';

    if (livros.length === 0) {
        tabelaBody.innerHTML = '<tr><td colspan="6">Nenhum livro encontrado</td></tr>';
        return;
    }

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${livros[0].lvr_titulo}</td>
        <td>R$ ${livros[0].lvr_codigo_de_barras}</td>
        <td>R$ ${livros[0].lvr_isbn}</td>
        <td>${livros[0].atr_nome || 'N/A'}</td>
        <td>${livros[0].edi_nome || 'N/A'}</td>
        <td>${livros[0].lvr_qtd_estoque}</td>
        <td>R$ ${livros[0].lvr_custo}</td>
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

