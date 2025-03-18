import { buscarUsuarioIdService } from '/scripts/service/usuarioService.js';

// Mensagem que mostra todos os dados do usuário cadastrado
document.querySelectorAll('.usuario-mostrado .usuario').forEach(usuario => {
    usuario.addEventListener('click', async function() {

        let main = document.querySelector('.main');
        let mensagemExistente = document.querySelector('.mensagem');
        let id = Number(this.querySelector('.usuario-id').textContent);

        if (mensagemExistente) {
            mensagemExistente.remove();
        } else {

            // Criando a mensagem
            let mensagem = document.createElement('div');
            mensagem.classList.add('mensagem');

            let usuario = await buscarUsuarioIdService(id);

            // Mostrando todos os dados
            mensagem.innerHTML = `
                <div class="button-mensagem">
                    <button>X</button>
                </div>
                <h2>Dados de ${usuario.usr_nome}</h2>
                <p><strong>Nome Completo: </strong>${usuario.usr_nome}<p/>
                <p><strong>E-mail: </strong>${usuario.usr_email}<p/>
                <p><strong>Telefone: </strong>${usuario.usr_telefone1}<p/>
                <p><strong>Telefone: </strong>${usuario.usr_telefone2}<p/>
                <p><strong>CPF: </strong>${usuario.usr_cpf}<p/>
                <p><strong>Gênero: </strong>${usuario.usr_genero}<p/>
                <p><strong>Data Nascimento: </strong>${usuario.usr_data_de_nascimento}<p/>
            `;

            main.appendChild(mensagem);

            // Evento para fechar a mensagem ao clicar no botão "X"
            document.querySelector('.button-mensagem button').addEventListener('click', function() {
                mensagem.remove();
            });
        }
    });
});