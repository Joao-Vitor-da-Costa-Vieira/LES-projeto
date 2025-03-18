import { ativarUsuarioService } from "/scripts/service/usuarioService.js";
import { buscarUsuariosInativosService } from "/scripts/service/usuarioService.js";

// Personalizando a msg de usuários inativos
let usuariosInativos = await buscarUsuariosInativosService();

if (usuariosInativos.length === 0) {
    let titulo = document.querySelector('.titulo');
    titulo.textContent = 'Nenhum Usuário Inativo';
    titulo.style.cssText = `
        box-shadow: 0px 0px 20px #0000005b;
        padding: 40px;
        border-radius: 20px;
    `;
}

// Reativando o usuário
document.querySelectorAll('.reativar').forEach(button => {
    button.addEventListener('click', async function() {
        const usuarioMostrado = this.closest('.usuario-mostrado');
        const id = usuarioMostrado.querySelector('.usuario-inat-id').textContent;

        let status = await ativarUsuarioService(id);

        if (status === 204) {
            location.reload();
        }
    });
});