import os
from pathlib import Path 
from google import genai
from google.genai import types
from dotenv import load_dotenv
from config.system_instruction import ai_instruction
from build.context_builder import build_base_context
from utils.genai_retry import retry_api_call

# Carrega o .env da pasta root
def load_env_from_root():
    """Carrega variáveis de ambiente do .env na pasta root"""
    root_dir = Path(__file__).resolve().parent.parent.parent 
    env_path = root_dir / '.env'
    load_dotenv(env_path)

#Configurando a IA
load_env_from_root()
api_key = os.getenv('GOOGLE_API_KEY')

if not api_key:
    raise ValueError("GOOGLE_API_KEY não encontrada no arquivo .env")

# Configurando a api_key
client = genai.Client(api_key=api_key)

#Defininfo o meumodelo e o conteúdo que eu vou mostrar
model = 'gemini-2.0-flash'
    
#Função que reseta as intruções do chat
def create_ai_chat():
     
    #Configurando o conteúdo que deve ser gerado
    chat_config = types.GenerateContentConfig(
        system_instruction = ai_instruction()
    )
    
    #Criando e retornando chat
    chat = client.chats.create(model=model, config=chat_config)
    
    #Configurando os dados para a IA
    retry_api_call(lambda: chat.send_message(build_base_context()))
    
    #Retornando o chat configurado
    return chat

