import requests as req

def buscar_usuario_por_id(usr_id):
    url = f'http://localhost:3000/api/usuarios/id/{usr_id}'
    
    try:
        res = req.get(url, timeout=5)

        res.raise_for_status()  
        usuario = res.json()
        if isinstance(usuario, list) and len(usuario) > 0:
            return usuario[0]
    except Exception as e:
        print(f"Erro ao buscar usuário {usr_id}: {e}")
        return None

def usuario_contexto(usuario):
    if not usuario:
        return "Usuário não encontrado."
    return (
        f'Nome: {usuario.get("usr_nome", "Desconhecido")}\n'
        f'Genero: {usuario.get("usr_genero", "Não informado")}\n'
        f'Data de Nascimento: {usuario.get("usr_data_de_nascimento", "Não informada")}\n'
        f'Telefone 1: {usuario.get("usr_telefone_1", "Não informado")}\n'
        f'Telefone 2: {usuario.get("usr_telefone_2", "Não informado")}\n'
        f'E-mail: {usuario.get("usr_email", "Não informado")}\n'
    )