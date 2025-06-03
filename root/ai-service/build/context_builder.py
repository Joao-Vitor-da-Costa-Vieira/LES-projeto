from apis.transacoes import pedidos_contexto
from apis.livros import livros_contexto

def formatar_usuario_contexto(usuario):
    if not usuario:
        return ""
    return (
        f'Nome: {usuario["usr_nome"]}\n'
        f'Genero: {usuario["usr_genero"]}\n'
        f'Data de Nascimento: {usuario["usr_data_de_nascimento"]}\n'
        f'Telefone: {usuario["usr_telefone"]}\n'
        f'E-mail: {usuario["usr_email"]}\n'
    )

def build_base_context():
    
    return f'''

[LIVROS DO SISTEMA]
{livros_contexto()}

'''
    

def build_chat_context(msg, usuario):
    
    return f'''
    
[MENSAGEM DO USUARIO]
{msg}

[DADOS DO USUARIO]
{formatar_usuario_contexto(usuario)}

[PEDIDOS DO USUARIO]
{pedidos_contexto(usuario['usr_id'])}

'''