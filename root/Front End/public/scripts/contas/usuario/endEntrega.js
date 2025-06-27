import { getAtualizarEndEntrega, getAdicionarEndEntrega } from "/scripts/service/usuario/enderecoEntregaService.js";

const usr_id = await getUserId();

document.querySelectorAll('.atualizar').forEach(button => {
    
    button.addEventListener('click', function(){
        const enderecoMostrado = this.closest('.endereco-mostrado');
        const id = enderecoMostrado.querySelector('.endereco-id').textContent;

        getAtualizarEndEntrega(id, usr_id);
    });
});

document.querySelectorAll('.adicionar').forEach(button => {
    
    button.addEventListener('click', function(){

        getAdicionarEndEntrega(usr_id);
    });
});