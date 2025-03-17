// Tratando da recuperação de senha
import { buscarUsuarioIdService } from "/scripts/service/usuarioService.js";
import { atualizarSenhaUsuarioService } from "/scripts/service/usuarioService.js";

document.querySelector('form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const senhaAtual = document.querySelector('.senha_input').value;

    // Pegando o ID do usuário
    const usr_id = window.location.pathname.split('/').splice(-1)[0];

    const usuario = await buscarUsuarioIdService(usr_id);

    if (usuario.usr_senha == senhaAtual) {
        const senhaNova = document.querySelector('.senha_nova_input').value;
        const senhaRep = document.querySelector('.senha_confirma_input').value;

        if (senhaNova.trim() !== '' && senhaRep.trim() !== '') {
            if (senhaNova === senhaRep) {
                // Alterando a senha no banco
                const status = await atualizarSenhaUsuarioService({
                    usr_senha: senhaNova
                }, usr_id);

                if (status === 204) {
                    alert('Senha atualizada com sucesso!');
                    window.location.reload();
                    return;
                }

                alert('Não foi possível atualizar a senha');
                return;
            }

            alert('Repetição da senha diferente da senha nova');
            return;
        }

        alert('Campos estão vazios');
        return;
    }

    alert('Senha não corresponde à senha atual cadastrada no banco');
});