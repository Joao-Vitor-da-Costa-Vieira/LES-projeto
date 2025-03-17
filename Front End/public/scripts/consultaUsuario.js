import { buscarUsuariosAtivosService } from "/scripts/service/usuarioService.js";
import { buscarUsuariosInativosService } from "/scripts/service/usuarioService.js";
import { inativarUsuarioService } from "/scripts/service/usuarioService.js";

// FILTRO DE USUÁRIOS
document.querySelector('#flt').addEventListener('click', () => {
    const filtro = document.querySelector('.filtro_usuarios');

    // Alterando a visibilidade do filtro
    if (filtro.style.display === 'none' || filtro.style.display === '') {
        filtro.style.display = 'grid';
        return;
    }

    filtro.style.display = 'none';
});

// ALTERAÇÃO DE USUÁRIO
document.querySelectorAll('.atualizar').forEach(botao => {
    botao.addEventListener('click', function (event) {
        event.stopPropagation();

        // Obtendo o id
        let usuarioMostrado = this.closest('.usuario-mostrado');
        let id = usuarioMostrado.querySelector('.usuario-id').textContent;

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
            <a href="/senha/${id}">Alterar senha</a>
            <a href="/endereco-cobranca/${id}">Alterar endereço de cobrança</a>
            <a href="/endereco-entrega/${id}">Alterar endereço de entrega</a>
            <a href="/cartao/${id}">Alterar cartão</a>
            <a href="/cadastro/${id}">Alterar tudo</a>
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
        let usuarioMostrado = this.closest('.usuario-mostrado');
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
        botao.href = '/usuarioInativo';
        botao.textContent = 'Ver Inativados';
        botao.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
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
    container.style.padding = '40px';
}