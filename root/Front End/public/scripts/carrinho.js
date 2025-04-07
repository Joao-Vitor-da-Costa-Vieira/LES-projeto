function calcularSubtotal(itens) {
    if (!itens || itens.length === 0) return 0;
    
    return itens.reduce((total, item) => {
        const precoComDesconto = item.livro.lvr_custo * (1 - (item.livro.lvr_desconto || 0) / 100);
        return total + (precoComDesconto * item.car_qtd_item);
    }, 0);
}