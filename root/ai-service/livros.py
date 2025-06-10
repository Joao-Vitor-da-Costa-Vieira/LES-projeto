import requests as req

#Criando cache para todos os livros
livros_cache = []

#Função que busca todos os livro do banco de dados
def buscar_todos_livros(url='http://localhost:3000/api/todos-livros'):
    
    global livros_cache;
    if len(livros_cache) == 0:
    
        #Obtendo a resposta da API
        res = req.get(url)
        
        #Verificando a requisição
        if not res.status_code == 200:
            print(f'Não foi possível obter os livros da API: {res.status_code}')
            return
        
        livros_cache = res.json()
        
    return livros_cache

#Função que retorna os livros organizados para a IA
def livros_contexto():
    
    context = ''
    livros = buscar_todos_livros()
    for livro in livros:
    
        context += (
            f"Título: {livro.get('lvr_titulo', 'Desconhecido')}\n"
            f"Autor: {livro.get('autores', 'Desconhecido')}\n"
            f"Editora: {livro.get('editoras', 'Desconhecido')}\n"
            f"Preço: R$ {livro.get('lvr_custo', '0')}\n"
            f"Quantidade em estoque: {livro.get('lvr_qtd_estoque', 0)}\n"
            f"Sinopse: {livro.get('lvr_sinopse', 'Sem sinopse')}\n\n"
        )

    if not livros:
         return 'Não foi possível obter a lista de livros no momento.\n\n'
        
    return str(context)