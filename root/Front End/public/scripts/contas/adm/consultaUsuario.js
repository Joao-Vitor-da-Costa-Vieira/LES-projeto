import {
    inativarUsuarioService,
    buscarUsuariosInativosService,
    buscarUsuariosAtivosService    
} from "/scripts/service/usuario/usuarioService.js";

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
                        route = `/senha?usr_id=${id}`;
                        break;
                    case 'endereco-cobranca':
                        route = `/endereco-cobranca?usr_id=${id}`;
                        break;
                    case 'endereco-entrega':
                        route = `/endereco-entrega?usr_id=${id}`;
                        break;
                    case 'endereco-cobranca/adicionar':
                        route = `/endereco-cobranca/adicionar?usr_id=${id}`;
                        break;
                    case 'endereco-entrega/adicionar':
                        route = `/endereco-entrega/adicionar?usr_id=${id}`;
                        break;
                    case 'cartao':
                        route = `/cartao?usr_id=${id}`;
                        break;
                    case 'cartao/adicionar':
                        route = `/cartao/adicionar?usr_id=${id}`;
                        break;
                    case 'atualizar':
                        route = `/atualizar?usr_id=${id}`;
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

// DESATIVANDO USUÁRIOS
document.querySelectorAll('.inativar').forEach(button => {
    button.addEventListener('click', async function (e) {
        e.preventDefault();
        e.stopPropagation();
        
        let usuarioMostrado = this.closest('tr');
        let id = usuarioMostrado.querySelector('.usuario-id').textContent;

        const status = await inativarUsuarioService(id);

        if (status === 204) {
            location.reload();
        }
    });
});

// Função que cria um botão dinâmico para a tela de inativos
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