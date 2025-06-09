from apis.livros import buscar_todos_livros
from apis.transacoes import buscar_pedidos_usuario
from apis.usuario import buscar_usuario_por_id

if __name__ == "__main__":
    print("Testando busca de livros:")
    print(buscar_todos_livros())

    print("\nTestando busca de pedidos do usuário 1:")
    print(buscar_pedidos_usuario(usr_id=1))

    print("\nTestando busca do usuário 1:")
    print(buscar_usuario_por_id(usr_id=1))
