import { getAtualizarEndEntregaAdm, getAdicionarEndEntregaAdm } from "/scripts/service/usuario/enderecoEntregaService.js";

const userDataElement = document.getElementById('user-data');
const usr_id = userDataElement.getAttribute('data-user-id');

document.querySelectorAll('.atualizar').forEach(button => {
    
    button.addEventListener('click', function(){
        const enderecoMostrado = this.closest('.endereco-mostrado');
        const id = enderecoMostrado.querySelector('.endereco-id').textContent;

        getAtualizarEndEntregaAdm(id, usr_id);
    });
});

document.querySelectorAll('.adicionar').forEach(button => {
    
    button.addEventListener('click', function(){

        getAdicionarEndEntregaAdm(usr_id);
    });
});