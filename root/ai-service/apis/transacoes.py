import requests as req
import datetime

# Função que busca os pedidos do usuario
def buscar_pedidos_usuario(usr_id):
    # Obtendo o id do usuario
    url = f'http://localhost:3000/api/pedidos/usuario/{usr_id}'
    
    # Obtendo os pedidos do usuario
    res = req.get(url)
    
    if not res.status_code == 200:
        print(f'Não foi possível obter os pedidos do usuario: {res.status_code}')
        return []
    
    pedidos = res.json()
    return pedidos

# Função auxiliar para formatar data
def formatar_data(data_str):
    try:
        # Tenta converter de ISO para objeto datetime
        data_obj = datetime.datetime.fromisoformat(data_str.replace('Z', '+00:00'))
        return data_obj.strftime('%d/%m/%Y')
    except:
        # Se falhar, retorna a string original
        return data_str

# Função que retorna os pedidos organizados para a IA
def pedidos_contexto(usr_id):
    context = ''
    pedidos = buscar_pedidos_usuario(usr_id)

    # Verificando se há pedidos para o usuario
    if not pedidos:
        return 'O usuário ainda não fez nenhum pedido'
    
    for pedido in pedidos:
        # Formata a data
        data_formatada = formatar_data(pedido["tra_data"])
        
        # Calcula quantidade total de itens
        quantidade_total = sum(item["itv_qtd_item"] for item in pedido.get("itens", []))
        
        context += (
            f'Número do Pedido: {pedido["tra_id"]}\n'
            f'Data do Pedido: {data_formatada}\n'
            f'Status do Pedido: {pedido["tra_status"]}\n'
            f'Valor Total: R$ {pedido["tra_valor"]:.2f}\n'
            f'Valor do Frete: R$ {pedido["tra_valor_frete"]:.2f}\n'
            f'Quantidade Total de Itens: {quantidade_total}\n'
        )
        
        # Adiciona detalhes dos itens
        if "itens" in pedido and pedido["itens"]:
            context += "Itens do Pedido:\n"
            for item in pedido["itens"]:
                context += (
                    f'  - Livro: {item["lvr_titulo"]}\n'
                    f'    Quantidade: {item["itv_qtd_item"]}\n'
                    f'    Preço Unitário: R$ {item["lvr_custo"]:.2f}\n'
                )
        
        context += "\n"  # Espaço entre pedidos
        
    return context