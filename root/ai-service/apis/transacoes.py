import requests as req

#Função que busca os pedidos do usuario
def buscar_pedidos_usuario(usr_id):
    
    #Obtendo o id do usuario
    url=f'http://localhost:3000/api/pedidos/usuario/{usr_id}'
    
    #Obtendo os pedidos do usuario
    res = req.get(url)
    
    if not res.status_code == 200:
        print(f'Não foi possível obter os pedidos do usuario: {res.status_code}')
        return 
    
    pedidos = res.json()
    return pedidos
    

#Função que retorna os pedidos organizados para a IA
def pedidos_contexto(usr_id):
    
    context = ''
    pedidos = buscar_pedidos_usuario()

    #Verificando se já pedidos para o usuario
    if not pedidos: return 'O usuario ainda não fez nenhum pedido';
    
    for pedido in pedidos:
    
        context  += (
            f'Nome do livro: {pedido['lvr_titulo']}\n'
            f'Número do Pedido: {pedido['vnd_numPedido']}\n'
            f'Data do Pedido: {pedido['vnd_data']}\n'
            f'Status do Pedido: {pedido['vnd_status']}\n'
            f'Valor Total: {pedido['vnd_valorTotal']}\n'
            f'Valo do Frete: {pedido['vnd_frete']}\n'
            f'Quantidade Comprada: {pedido['vnd_qtd']}\n'
            f'Quantidade Trocada: {pedido['vnd_qtd_trocada']}\n\n' 
        )
        
    return str(context)