from apis.pedidos import pedidos_contexto
from apis.livros import livros_contexto
from apis.usuarios import usuario_contexto

def buil_base_context():
    
    return f'''

[LIVROS DO SISTEMA]
{livros_contexto()}

[DADOS DO USUARIO]
{usuario_contexto()}

'''
    

def build_chat_context(msg):
    
    return f'''
    
[MENSAGEM DO USUARIO]
{msg}

[PEDIDOS DO USUARIO]
{pedidos_contexto()}

'''