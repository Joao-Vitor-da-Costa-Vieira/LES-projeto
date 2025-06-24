import { getAtualizarEndEntrega } from "/scripts/service/usuario/enderecoEntregaService.js";

const userDataElement = document.getElementById('user-data');
const usr_id = userDataElement ? userDataElement.dataset.userId : null;

document.querySelectorAll('.atualizar').forEach(button => {
    
    button.addEventListener('click', function(){
        const enderecoMostrado = this.closest('.endereco-mostrado');
        const id = enderecoMostrado.querySelector('.endereco-id').textContent;

        getAtualizarEndEntrega(id, usr_id);
    });
});