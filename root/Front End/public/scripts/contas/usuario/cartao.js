import { getAtualizarCartao } from "/scripts/service/usuario/cartaoService.js";

const userDataElement = document.getElementById('user-data');
const usr_id = userDataElement ? userDataElement.dataset.userId : null;

document.querySelectorAll('.atualizar').forEach(button => {
    
    button.addEventListener('click', function(){
        const enderecoMostrado = this.closest('.cartoes-mostrado');
        const id = enderecoMostrado.querySelector('.cartoes-id').textContent;

        getAtualizarCartao(id,usr_id);
    });
});