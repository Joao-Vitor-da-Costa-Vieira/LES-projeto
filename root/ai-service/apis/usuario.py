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
