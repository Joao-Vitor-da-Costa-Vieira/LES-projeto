import { buscarEnderecoEntregaIdService } from '/scripts/service/enderecoEntregaService.js';

// Gerando uma mensagem para os endereços
document.querySelectorAll('.endereco-mostrado .endereco').forEach(endereco => {
    endereco.addEventListener('click', async function() {

        let containerEndereco = document.querySelector('.container-endereco');
        let mensagemExistente = document.querySelector('.mensagem');
        let id = Number(this.querySelector('.endereco-id').textContent);

        if (mensagemExistente) {
            mensagemExistente.remove();
        } else {

            // Criando a mensagem
            let mensagem = document.createElement('div');
            mensagem.classList.add('mensagem');

            let enderecoDetalhes = await buscarEnderecoEntregaIdService(id);

            // Mostrando todos os dados
            mensagem.innerHTML = `
                <div class="button-mensagem">
                    <button>X</button>
                </div>
                <h2>Dados de ${enderecoDetalhes.end_endereco}</h2>
                <p><strong>Nome: </strong>${enderecoDetalhes.end_nome}<p/>
                <p><strong>Tipo de Residência: </strong>${enderecoDetalhes.end_tipoResidencia}<p/>
                <p><strong>Tipo de Endereço: </strong>${enderecoDetalhes.end_tipoEndereco}<p/>
                <p><strong>Endereço: </strong>${enderecoDetalhes.end_endereco}<p/>
                <p><strong>Número: </strong>${enderecoDetalhes.end_numero}<p/>
                <p><strong>Bairro: </strong>${enderecoDetalhes.end_bairro}<p/>
                <p><strong>CEP: </strong>${enderecoDetalhes.end_cep}<p/>
                <p><strong>Cidade: </strong>${enderecoDetalhes.end_cidade}<p/>
                <p><strong>Estado: </strong>${enderecoDetalhes.end_estado}<p/>
                <p><strong>País: </strong>${enderecoDetalhes.end_pais}<p/>
            `;

            containerEndereco.appendChild(mensagem);

            // Evento para fechar a mensagem ao clicar no botão "X"
            document.querySelector('.button-mensagem button').addEventListener('click', function() {
                mensagem.remove();
            });
        }
    });
});