import { 
    inativarUsuarioService,
    ativarUsuarioService
} from "/scripts/service/usuario/usuarioService.js";

const pesquisaBotao = document.querySelector("#pesquisa-botao");
const tabelaBody = document.querySelector("tbody");

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
        
        const userDataElement = this.closest('[data-usuario-id]');
        const usr_id = userDataElement ? userDataElement.dataset.usuarioId : null;

        const status = await inativarUsuarioService(usr_id);

        if (status === 204) {
            location.reload();
        }
    });
});

document.querySelectorAll('.reativar').forEach(button => {
    button.addEventListener('click', async function (e) {
        e.preventDefault();
        e.stopPropagation();
        
        const userDataElement = this.closest('[data-usuario-id]');
        const usr_id = userDataElement ? userDataElement.dataset.usuarioId : null;

        const status = await ativarUsuarioService(usr_id);

        if (status === 204) {
            location.reload();
        }
    });
});

// Função para atualizar a tabela com os resultados
function atualizarTabela(usuarios) {
    tabelaBody.innerHTML = '';

    if (livros.length === 0) {
        tabelaBody.innerHTML = '<tr><td colspan="6">Nenhum usuario encontrado</td></tr>';
        return;
    }

    usuarios.forEach(usuario => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td> </td>
                <td>${usuario.usr_nome}</td>
                <td>${usuario.usr_email}</td>
                <td>${usuario.usr_cpf}</td>
                <td id="usuario-data" data-usuario-id="${usuario.usr_id}">
                    <div class="botoes_resultado">
                        <button class="reativar">Reativar</button>
                        <button class="inativar">Inativar</button>
                    </div>
                </td>
        `;
        tabelaBody.appendChild(row);
    });
}

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