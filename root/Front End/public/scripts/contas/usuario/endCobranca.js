import { getAtualizarEndCobranca } from "/scripts/service/usuario/enderecoCobrancaService.js";

const userDataElement = document.getElementById('user-data');
const usr_id = userDataElement ? userDataElement.dataset.userId : null;

document.querySelectorAll('.atualizar').forEach(button => {
    
    button.addEventListener('click', function(){
        const enderecoMostrado = this.closest('.endereco-mostrado');
        const id = enderecoMostrado.querySelector('.endereco-id').textContent;

        getAtualizarEndCobranca(id, usr_id);
    });
});