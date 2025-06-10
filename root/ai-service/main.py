from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from config.chat import create_ai_chat
from build.context_builder import build_chat_context
from utils.genai_retry import retry_api_call
from usuario import buscar_usuario_por_id

#Criando o app do FastAPI
app = FastAPI()

#Configurando o CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

#Guardando os chats dos clientes
chats_por_usuario = {}

#Criando um modelo para receber a msg do Cliente
class PerguntaComUsuario(BaseModel):
    msg: str
    usr_id: int 

#Criando um endpoint
@app.post('/ai')
def chatbot(pergunta: PerguntaComUsuario):
    global chats_por_usuario

    usr_id_logado = pergunta.usr_id

    usuario = buscar_usuario_por_id(usr_id_logado)
    
    #Gerando msg para enviar para a IA
    mensagem_chatbot = build_chat_context(pergunta.msg, usuario)
    
    #Criando novo chat caso o usuario logado mude
    if usr_id_logado not in chats_por_usuario:
        chats_por_usuario[usr_id_logado] = create_ai_chat()
        
    #Definindo o char do usuario atual
    chat = chats_por_usuario[usr_id_logado]
    
    #Retornando a resposta da IA
    resposta = retry_api_call(lambda: chat.send_message(mensagem_chatbot))
    return {'ai_res': resposta.text}
