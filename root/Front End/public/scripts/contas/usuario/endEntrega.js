import { atualizarEndEntrega } from "/scripts/service/usuario/enderecoEntregaService.js";

document.querySelectorAll('.atualizar').forEach(button => {
    
    button.addEventListener('click', function(){
        const enderecoMostrado = this.closest('.endereco-mostrado');
        const id = enderecoMostrado.querySelector('.endereco-id').textContent;

        const path = window.location.pathname + `/atualizar/${id}`;

        atualizarEndEntrega(path);
    });
});