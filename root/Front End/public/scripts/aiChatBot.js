document.addEventListener('DOMContentLoaded', function(){
    const chatbotNavButton = document.getElementById('botao-chatbot-navbar');
    const chat = document.querySelector('.chat');
    const closeButton = document.querySelector('.close-chat');
    const screen = document.querySelector('.screen');
    const userDataElement = document.getElementById('user-data');
    
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

    enviarMsg(userDataElement);

});

//Enviando um texto para a IA
async function enviarMsg(userDataElement) {
    let screen = document.querySelector('.screen');
    let button = document.querySelector('#ai-button');
    let input = document.querySelector('.chat .input input');

    const usr_id = userDataElement ? userDataElement.dataset.userId : null;

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
            background-color: white;
            color: black;
            border: 1px solid black;
        `;
        p_usuario.style.cssText = estilo_usuario;
        p_usuario.innerHTML = msg;
        screen.appendChild(p_usuario);

        input.value = '';
        screen.scrollTop = screen.scrollHeight;

        //Bot
        const resposta = await obterRespostaIa(msg, usr_id);
        const p_bot = document.createElement('p');
        const estilo_bot = `
            margin: 0px 20px 30px 0
            border: #0003c8;
            background-color: #0003c8;
            color: white;
        `;
        p_bot.style.cssText = estilo_bot;
        p_bot.innerHTML = resposta;
        screen.appendChild(p_bot);

        screen.scrollTop = screen.scrollHeight;
    });
}

//Função que busca a resposta da IA com base em um texto
async function obterRespostaIa(msg, usr_id){

    try{
        const res = await fetch('http://localhost:8000/ai/',{
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                msg: msg,
                usr_id: usr_id  
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