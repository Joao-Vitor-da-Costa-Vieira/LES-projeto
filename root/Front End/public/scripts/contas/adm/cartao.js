import { getAtualizarCartaoAdm, getAdicionarCartaoAdm } from "/scripts/service/usuario/cartaoService.js";

const userDataElement = document.getElementById('user-data');
const usr_id = userDataElement.getAttribute('data-user-id');

document.querySelectorAll('.atualizar').forEach(button => {
    
    button.addEventListener('click', function(){
        const enderecoMostrado = this.closest('.cartoes-mostrado');
        const id = enderecoMostrado.querySelector('.cartoes-id').textContent;

        getAtualizarCartaoAdm(id,usr_id);
    });
});

document.querySelectorAll('.adicionar').forEach(button => {
    
    button.addEventListener('click', function(){

        getAdicionarCartaoAdm(usr_id);
    });
});