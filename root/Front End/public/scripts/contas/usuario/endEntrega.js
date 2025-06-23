import { atualizarEndEntrega } from "../../service/usuario/enderecoEntregaService";

document.querySelectorAll('.atualizar').forEach(button => {
    
    button.addEventListener('click', function(){
        const enderecoMostrado = this.closest('.endereco-mostrado');
        const id = enderecoMostrado.querySelector('.endereco-id').textContent;

        const path = window.location.pathname + `/atualizar/${id}`;

        atualizarEndEntrega(path);
    });
});