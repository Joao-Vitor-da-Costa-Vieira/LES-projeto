import { atualizarCartao } from "../../service/usuario/cartaoService";

document.querySelectorAll('.atualizar').forEach(button => {
    
    button.addEventListener('click', function(){
        const enderecoMostrado = this.closest('.cartoes-mostrado');
        const id = enderecoMostrado.querySelector('.cartoes-id').textContent;

        const path = window.location.pathname + `/atualizar/${id}`;

        atualizarCartao(path);
    });
});