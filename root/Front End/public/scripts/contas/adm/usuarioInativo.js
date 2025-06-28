import { 
    inativarUsuarioService,
    ativarUsuarioService
} from "/scripts/service/usuario/usuarioService.js";

const pesquisaBotao = document.querySelector("#pesquisa-botao");

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

document.querySelectorAll('.inativar').forEach(button => {
    button.addEventListener('click', async function (e) {
        e.preventDefault();
        e.stopPropagation();
        
        let usuarioMostrado = this.closest('tr');
        let id = usuarioMostrado.querySelector('.usuario-inat-id').textContent;

        const status = await inativarUsuarioService(id);

        if (status === 204) {
            location.reload();
        }
    });
});

document.querySelectorAll('.reativar').forEach(button => {
    button.addEventListener('click', async function (e) {
        e.preventDefault();
        e.stopPropagation();
        
        let usuarioMostrado = this.closest('tr');
        let id = usuarioMostrado.querySelector('.usuario-inat-id').textContent;

        const status = await ativarUsuarioService(id);

        if (status === 204) {
            location.reload();
        }
    });
});

// Função para coletar os filtros do formulário
function coletarFiltros() {
    return {
        nome: document.querySelector('.nome_input')?.value || null,
        email: document.querySelector('.email_input')?.value || null,
        cpf: document.querySelector('.cpf_input')?.value || null,
        dataNascimento: document.querySelector('#data_nascimento')?.value || null,
        telefone: document.querySelector('.telefone_input')?.value || null,
        genero: document.querySelector('.selecao')?.value || null,
    };
}

pesquisaBotao.addEventListener('click', async (e) => {
    e.preventDefault();
    
    try {
        const filtros = coletarFiltros();
        const livros = await filtroUsuarioService(filtros);
        atualizarTabela(livros);
    } catch (error) {
        console.error('Erro ao pesquisar livros:', error);
        tabelaBody.innerHTML = '<tr><td colspan="6">Erro ao carregar os usuarios</td></tr>';
    }
});