import {
    inativarUsuarioService,
    buscarUsuariosInativosService,
    buscarUsuariosAtivosService    
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

document.querySelectorAll('.atualizar').forEach(botao => {
    botao.addEventListener('click', function (event) {
        event.stopPropagation();

        // Obtendo o id
        let usuarioMostrado = this.closest('tr');
        let idElement = usuarioMostrado.querySelector('.usuario-id');
        let id = idElement.textContent; 

        // Retirando o menu ao clicar de novo
        let submenuAtual = this.querySelector('.atualizar_submenu');

        if (submenuAtual) {
            submenuAtual.remove();
            return;
        }

        document.querySelectorAll('.atualizar_submenu').forEach(menu => menu.remove());

        let submenu = document.createElement('div');
        submenu.classList.add('atualizar_submenu');

        submenu.innerHTML = `
            <button class="submenu-botao" data-action="senha">Senha</button>
            <button class="submenu-botao" data-action="endereco-cobranca">Endereços de cobrança</button>
            <button class="submenu-botao" data-action="endereco-entrega">Endereços de entrega</button>
            <button class="submenu-botao" data-action="endereco-cobranca/adicionar">Adicionar Endereço de cobrança</button>
            <button class="submenu-botao" data-action="endereco-entrega/adicionar">Adicionar Endereço de entrega</button>
            <button class="submenu-botao" data-action="cartao">Cartões</button>
            <button class="submenu-botao" data-action="cartao/adicionar">Adicionar Cartão</button>
            <button class="submenu-botao" data-action="atualizar">Atualizar Cadastro</button>
        `;

        // Adicionando event listeners aos botões do submenu
        submenu.querySelectorAll('.submenu-botao').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const action = btn.dataset.action;
                let route;
                
                // Mapeando ações para rotas conforme fornecido
                switch(action) {
                    case 'senha':
                        route = `/senha-adm?usr_id=${id}`;
                        break;
                    case 'endereco-cobranca':
                        route = `/endereco-cobranca-adm?usr_id=${id}`;
                        break;
                    case 'endereco-entrega':
                        route = `/endereco-entrega-adm?usr_id=${id}`;
                        break;
                    case 'endereco-cobranca/adicionar':
                        route = `/endereco-cobranca-adm/adicionar?usr_id=${id}`;
                        break;
                    case 'endereco-entrega/adicionar':
                        route = `/endereco-entrega-adm/adicionar?usr_id=${id}`;
                        break;
                    case 'cartao':
                        route = `/cartao-adm?usr_id=${id}`;
                        break;
                    case 'cartao/adicionar':
                        route = `/cartao-adm/adicionar?usr_id=${id}`;
                        break;
                    case 'atualizar':
                        route = `/atualizar-adm?usr_id=${id}`;
                        break;
                    default:
                        return;
                }
                
                window.location.href = route;
            });
        });

        this.appendChild(submenu);
    });
});

document.addEventListener('click', () => {
    document.querySelectorAll('.atualizar_submenu').forEach(menu => menu.remove());
});

document.querySelectorAll('.inativar').forEach(button => {
    button.addEventListener('click', async function (e) {
        e.preventDefault();
        e.stopPropagation();
        
        const userDataElement = this.closest('[data-usuario-id]');
        const usr_id = userDataElement ? userDataElement.dataset.usuarioId : null;

        const status = await inativarUsuarioService(id);

        if (status === 204) {
            location.reload();
        }
    });
});

export function criarBotaoInativados() {
    if (!document.getElementById('btn-inativados')) {
        let botao = document.createElement('a');
        botao.id = 'btn-inativados';
        botao.href = '/inativos';
        botao.textContent = 'Ver Inativados';
        botao.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #0003c8;
            width: 250px;
            height: 50px;
            align-items: center;
            color: #ffffff;
            text-decoration: none;
            cursor: pointer;
            border: #0003c8;
        `;

        document.body.appendChild(botao);
    }
}

// Mostrar o botão automaticamente se já houver inativos
let usuariosInativos = await buscarUsuariosInativosService();

if (usuariosInativos.length > 0) {
    criarBotaoInativados();
}

// USUÁRIOS ATIVOS
let usuariosAtivos = await buscarUsuariosAtivosService();

if (usuariosAtivos.length === 0) {
    let container = document.querySelector('.msg-usuarios');
    if (container) {
        container.innerHTML = '<h1 style="margin: 0">Nenhum Usuário Ativo</h1>';
    }
}

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

    const userDataElement = this.closest('[data-usuario-id]');
    const usr_id = userDataElement ? userDataElement.dataset.usuarioId : null;
    
    try {
        const filtros = coletarFiltros();
        const livros = await filtroUsuarioService(filtros, usr_id);
        atualizarTabela(livros);
    } catch (error) {
        console.error('Erro ao pesquisar livros:', error);
        tabelaBody.innerHTML = '<tr><td colspan="6">Erro ao carregar os usuarios</td></tr>';
    }
});