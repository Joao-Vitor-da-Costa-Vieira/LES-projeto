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
    
        context  += (
             f"Título: {livro['lvr_titulo']}\n"
            f"Autor: {livro['atr_nome']}\n"
            f"Editora: {livro['edi_nome']}\n"
            f"Preço: R$ {livro['lvr_custo']:.2f}\n"
            f"Quantidade em estoque: {livro['lvr_qtd_estoque']}\n"
            f"Sinopse: {livro['lvr_sinopse']}\n\n"
        )
        
    return str(context)