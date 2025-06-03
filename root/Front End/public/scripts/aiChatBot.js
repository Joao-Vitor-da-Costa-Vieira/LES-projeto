document.addEventListener('DOMContentLoaded', function(){
    const chatbotNavButton = document.getElementById('botao-chatbot-navbar');
    const chat = document.querySelector('.chat');
    const closeButton = document.querySelector('.close-chat');
    const screen = document.querySelector('.screen');
    
    chat.style.display = 'none';

    function abrirChat() {
        chat.style.display = 'grid';
        // Rolar para o final do chat
        if(screen) {
            screen.scrollTop = screen.scrollHeight;
        }
    }

    function fecharChat() {
        chat.style.display = 'none';
    }

    if(chatbotNavButton) {
        chatbotNavButton.addEventListener('click', () => {
            if(chat.style.display === 'none') {
                abrirChat();
            } else {
                fecharChat();
            }
        });
    }

    if(closeButton) {
        closeButton.addEventListener('click', fecharChat);
    }

    document.addEventListener('click', (event) => {
        if (chat.style.display === 'grid' && 
           !chat.contains(event.target) &&
           event.target !== chatbotNavButton) {
            fecharChat();
        }
    });

    //Chamando Todas as funções do documento
    enviarMsg();
    resetarLocalStorage();

});

//Enviando um texto para a IA
async function enviarMsg() {
    let screen = document.querySelector('.screen');
    let button = document.querySelector('#ai-button');
    let input = document.querySelector('.chat .input input');
    const usuario = window.usuarioLogado;

    //Obtendo o ID atual e todos os outros IDs com chats
    let usr_id = JSON.parse(localStorage.getItem('usr_id')) || [];
    let idAtual = String(usuario[0].usr_id);
    let chaveHistorico = `chatHistorico_${idAtual}`;

    //Verificando se o cliente logado foi alterado
    if (!usr_id.includes(idAtual)) {
        usr_id.push(idAtual);
        localStorage.setItem('usr_id', JSON.stringify(usr_id));
    }

    //Carregando histórico salvo se existir
    let historico = JSON.parse(localStorage.getItem(chaveHistorico)) || [];

    //Renderizando todas as mensagens salvas
    historico.forEach(msg => {
        const p = document.createElement('p');
        p.innerHTML = msg.texto;
        p.style.cssText = msg.estilo;
        screen.appendChild(p);
    });

    //Enviando nova mensagem
    button.addEventListener('click', async (event) => {
        event.preventDefault();

        if (!input.value) {
            alert('Digite algo antes de enviar');
            return;
        }

        const msg = input.value;

        //Usuario
        const p_usuario = document.createElement('p');
        const estilo_usuario = `
            margin: 0 0 30px 20px; 
            border-radius: 20px 0px 0px 20px;
            background-color: #F4F440;
            color: black;
            border: 1px dashed black;
            border-right: none;
        `;
        p_cliente.style.cssText = estilo_usuario;
        p_cliente.innerHTML = msg;
        screen.appendChild(p_usuario);

        historico.push({ texto: msg, estilo: estilo_usuario });

        input.value = '';
        screen.scrollTop = screen.scrollHeight;

        //Bot
        const resposta = await obterRespostaIa(msg, usuario);
        const p_bot = document.createElement('p');
        const estilo_bot = 'margin: 0px 20px 30px 0;';
        p_bot.style.cssText = estilo_bot;
        p_bot.innerHTML = resposta;
        screen.appendChild(p_bot);

        historico.push({ texto: resposta, estilo: estilo_bot });

        //Salva histórico no localStorage com chave do cliente
        localStorage.setItem(chaveHistorico, JSON.stringify(historico));

        screen.scrollTop = screen.scrollHeight;
    });
}

async function resetarLocalStorage(){
    const res = await fetch('/api/version');
    const versaoServidor = await res.text(); 
    const versaoAnterior = localStorage.getItem('server_version');

    if (versaoAnterior && versaoAnterior !== versaoServidor) {

        //Limpando histórico se o servidor reiniciou
        const usr_id = JSON.parse(localStorage.getItem('usr_id')) || [];
        usr_id.forEach(id => {
            localStorage.removeItem(`chatHistorico_${id}`);
        });
        localStorage.setItem('usr_id', '[]');
    }

    localStorage.setItem('server_version', versaoServidor);
}

//Função que busca a resposta da IA com base em um texto
async function obterRespostaIa(msg){

    try{
        const res = await fetch('http://localhost:8000/ai/',{
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                msg: msg,
                usuario: usuario  
            })
        });

        //Obtendo o msg
        msg = await res.json();
        return msg.ai_res;

    }catch(err){
        console.log(`Erro no assistent.js: ${err}`);
        throw err;
    }
}