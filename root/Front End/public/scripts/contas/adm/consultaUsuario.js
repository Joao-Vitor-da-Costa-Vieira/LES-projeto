import { buscarUsuariosAtivosService } from "/../scripts/service/usuario/usuarioService.js";
import { buscarUsuariosInativosService } from "/../scripts/service/usuario/usuarioService.js";
import { inativarUsuarioService } from "/../scripts/service/usuario/usuarioService.js";


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
             <button class="submenu-botao" onclick="window.location.href='/senha/${id}'">Atualizar senha</button>
    <button class="submenu-botao" onclick="window.location.href='/endereco-cobranca/${id}'">Atualizar endereço de cobrança</button>
    <button class="submenu-botao" onclick="window.location.href='/endereco-entrega/${id}'">Atualizar endereço de entrega</button>
        <button class="submenu-botao" onclick="window.location.href='/endereco-cobranca/${id}/adicionar'">Adicionar endereço de cobrança</button>
    <button class="submenu-botao" onclick="window.location.href='/endereco-entrega/${id}/adicionar'">Adicionar endereço de entrega</button>
    <button class="submenu-botao" onclick="window.location.href='/cartao/${id}'">Atualizar cartão</button>
        <button class="submenu-botao" onclick="window.location.href='/cartao/${id}/adicionar'">Adicionar cartão</button>
        <button class="submenu-botao" onclick="window.location.href='/cadastro/${id}'">Atualizar tudo</button>
        `;

        // Adicionando submenu ao lado do botão clicado
        this.appendChild(submenu);
    });
});

// Removendo o submenu ao clicar fora da tela
document.addEventListener('click', () => {
    document.querySelectorAll('.atualizar_submenu').forEach(menu => menu.remove());
});

// DESATIVANDO USUÁRIOS
document.querySelectorAll('.inativar').forEach(button => {
    button.addEventListener('click', async function () {
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

// Personalizando uma mensagem para quando não houver usuários ativos
let usuariosAtivos = await buscarUsuariosAtivosService();

if (usuariosAtivos.length === 0) {
    let container = document.querySelector('.msg-usuarios');
    container.innerHTML = '<h1 style="margin: 0">Nenhum Usuário Ativo</h1>';

}