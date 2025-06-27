import { getAtualizarCartao, getAdicionarCartao } from "/scripts/service/usuario/cartaoService.js";
import { getUserId } from "/scripts/service/usuario/usuarioService.js";

const usr_id = await getUserId();

document.querySelectorAll('.atualizar').forEach(button => {
    
    button.addEventListener('click', function(){
        const enderecoMostrado = this.closest('.cartoes-mostrado');
        const id = enderecoMostrado.querySelector('.cartoes-id').textContent;

        getAtualizarCartao(id,usr_id);
    });
});

document.querySelectorAll('.adicionar').forEach(button => {
    
    button.addEventListener('click', function(){

        getAdicionarCartao(usr_id);
    });
});