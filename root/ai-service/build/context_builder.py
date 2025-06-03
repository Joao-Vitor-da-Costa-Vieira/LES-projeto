from apis.transacoes import pedidos_contexto
from apis.livros import livros_contexto

def formatar_usuario_contexto(usuario):

    print("DEBUG - Conteúdo do usuário:", usuario)

    if not usuario:
        return ""
    return (
        f'Nome: {usuario.get("usr_nome", "Desconhecido")}\n'
        f'Genero: {usuario.get("usr_genero", "Não informado")}\n'
        f'Data de Nascimento: {usuario.get("usr_data_de_nascimento", "Não informada")}\n'
        f'Telefone 1: {usuario.get("usr_telefone_1", "Não informado")}\n'
        f'Telefone 2: {usuario.get("usr_telefone_2", "Não informado")}\n'
        f'E-mail: {usuario.get("usr_email", "Não informado")}\n'
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