import { buscarUsuarioIdService } from "/scripts/service/usuarioService.js";
import { atualizarSenhaUsuarioService } from "/scripts/service/usuarioService.js";


document.querySelector('form').addEventListener('submit', async function (event) {
    event.preventDefault();

    // Esconder todos os spans de erro inicialmente
    document.querySelectorAll('.erro').forEach(span => span.style.display = 'none');

    const senhaAtual = document.querySelector('.senha_input').value;

    // Pegando o ID do usuário
    const usr_id = window.location.pathname.split('/').splice(-1)[0];

    console.log(usr_id);

    const usuario = await buscarUsuarioIdService(usr_id);

    if (usuario.usr_senha === senhaAtual) {
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

            // Mostrar erro de repetição de senha
            document.getElementById('erroConfSenha').style.display = 'inline';
            alert('Repetição da senha diferente da senha nova');
            return;
        }

        // Mostrar erro de campos vazios
        if (senhaNova.trim() === '') {
            document.getElementById('erroSenhaNova').style.display = 'inline';
        }
        if (senhaRep.trim() === '') {
            document.getElementById('erroConfSenha').style.display = 'inline';
        }
        alert('Campos estão vazios');
        return;
    }

    // Mostrar erro de senha atual incorreta
    document.getElementById('erroSenha').style.display = 'inline';
    alert('Senha não corresponde à senha atual cadastrada no banco');
});