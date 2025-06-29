import { filtroLivroService, estoqueService } from "/scripts/service/livroService.js";

const pesquisaBotao = document.querySelector("#pesquisa-botao");
const tabelaBody = document.querySelector("tbody");
const elementosOcultos = document.querySelectorAll('.hidden');

let hiddenVerificador = 0;

document.getElementById('Entrada').addEventListener('submit', async function (event) {
  event.preventDefault();

    // Captura os valores dos campos
    const formulario = new FormData(event.target);
    const dados = Object.fromEntries(formulario.entries());

    const livroId = document.querySelector('td[data-livro-id]')?.dataset.livroId;

    const hoje = new Date();
    const dataFormatada = hoje.toISOString().split('T')[0];

    const entrada = {
        est_quantidade: dados.qtd_estoque,
        est_custo: dados.custo,
        est_fornecedor: dados.fornecedor,
        livros_lvr_id: livroId,
        est_data: dataFormatada
    };
    
    try {
        const status = await estoqueService(entrada);
    
        if(status === 200){
            alert('Entrada foi confirmada com Sucesso!');
            return;
        }

    } catch (error) {
        console.error('Erro:', error);
        alert(error.message);
    }
});

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
        <td style="display: none;" id="livro-data" data-livro-id="${livros[0].lvr_id}"></td>
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
        tabelaBody.innerHTML = '<tr><td colspan="7">Erro ao carregar o livro</td></tr>';
    }
});

