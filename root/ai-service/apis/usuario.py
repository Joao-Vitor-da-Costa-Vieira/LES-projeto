import requests as req

def buscar_usuario_por_id(usr_id):
    url = f'http://localhost:3000/api/usuarios/id/{usr_id}'
    
    try:
        res = req.get(url)
        res.raise_for_status()  # Levanta um erro para códigos HTTP 4xx ou 5xx
        return res.json()
    except Exception as e:
        print(f"Erro ao buscar usuário {usr_id}: {e}")
        return None
