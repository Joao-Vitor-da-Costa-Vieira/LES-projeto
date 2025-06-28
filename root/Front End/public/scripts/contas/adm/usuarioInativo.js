import { 
    inativarUsuarioService,
    ativarUsuarioService
} from "/scripts/service/usuario/usuarioService.js";

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