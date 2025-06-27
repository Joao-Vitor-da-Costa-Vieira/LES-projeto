import { getAtualizarEndCobranca, getAdicionarEndCobranca } from "/scripts/service/usuario/enderecoCobrancaService.js";
import { getUserId } from "/scripts/service/usuario/usuarioService.js";

const usr_id = await getUserId();

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