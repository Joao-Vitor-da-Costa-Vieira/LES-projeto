import { atualizarEndCobranca } from "../../service/usuario/enderecoCobrancaService";

document.querySelectorAll('.atualizar').forEach(button => {
    
    button.addEventListener('click', function(){
        const enderecoMostrado = this.closest('.endereco-mostrado');
        const id = enderecoMostrado.querySelector('.endereco-id').textContent;

        const path = window.location.pathname + `/atualizar/${id}`;

        atualizarEndCobranca(path);
    });
});