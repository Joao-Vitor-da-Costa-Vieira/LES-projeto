import { 
    inativarUsuarioService
} from "/scripts/service/usuario/usuarioService.js";

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

        const status = await inativarUsuarioService(id);

        if (status === 204) {
            location.reload();
        }
    });
});