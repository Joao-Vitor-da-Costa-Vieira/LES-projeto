import { getAtualizarEndCobrancaAdm, getAdicionarEndCobrancaAdm } from "/scripts/service/usuario/enderecoCobrancaService.js";

const userDataElement = document.getElementById('user-data');
const usr_id = userDataElement.getAttribute('data-user-id');

document.querySelectorAll('.atualizar').forEach(button => {
    
    button.addEventListener('click', function(){
        const enderecoMostrado = this.closest('.endereco-mostrado');
        const id = enderecoMostrado.querySelector('.endereco-id').textContent;

        getAtualizarEndCobrancaAdm(id, usr_id);
    });
});

document.querySelectorAll('.adicionar').forEach(button => {
    
    button.addEventListener('click', function(){

        getAdicionarEndCobrancaAdm(usr_id);
    });
});