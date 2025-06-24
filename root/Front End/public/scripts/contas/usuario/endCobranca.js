import { getAtualizarEndCobranca, getAdicionarEndCobranca } from "/scripts/service/usuario/enderecoCobrancaService.js";

const userDataElement = document.getElementById('user-data');
const usr_id = userDataElement ? userDataElement.dataset.userId : null;

document.querySelectorAll('.atualizar').forEach(button => {
    
    button.addEventListener('click', function(){
        const enderecoMostrado = this.closest('.endereco-mostrado');
        const id = enderecoMostrado.querySelector('.endereco-id').textContent;

        getAtualizarEndCobranca(id, usr_id);
    });
});

document.querySelectorAll('.adicionar').forEach(button => {
    
    button.addEventListener('click', function(){

        getAdicionarEndCobranca(usr_id);
    });
});