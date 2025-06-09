from apis.transacoes import pedidos_contexto
from apis.livros import livros_contexto
from apis.usuario import usuario_contexto


def build_base_context():
    
    return f'''

[LIVROS DO SISTEMA]
{livros_contexto()}

'''
    

def build_chat_context(msg, usuario):
    base_context = build_base_context()
    usr_id = usuario.get('usr_id') if usuario else None
    pedidos = pedidos_contexto(usr_id) if usr_id else 'Usuário não encontrado ou sem pedidos.'
    usuario_info = usuario_contexto(usuario) if usuario else 'Usuário não encontrado.'
    return f'''

{base_context}
    
[MENSAGEM DO USUARIO]
{msg}

[DADOS DO USUARIO]
{usuario_info}

[PEDIDOS DO USUARIO]
{pedidos}

'''