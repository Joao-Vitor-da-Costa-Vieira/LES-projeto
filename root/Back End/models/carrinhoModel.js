async function buscarItensCarrinho(usr_id) {
    try {
        const [itens] = await db.query('SELECT * FROM carrinho WHERE usuarios_usr_id = ?',  [usr_id]);
        return itens;
    } catch (err) {
        console.error("Erro no buscarItensCarrinho - modelCarrinho: ${err}");
        throw err;
    }
}

async function deletarItensCarrinho(car_id) {
    try {
        const [resultado] = await db.query('DELETE * FROM carrinho WHERE car_id = ?', [car_id]);
        return resultado;
    } catch (err) {
        console.error("Erro no deletarItensCarrinho - modelCarrinho: ${err}");
        throw err;
    }
}

async function atualizarItensCarrinho(car_id,qtd) {
    try {
        const [resultado] = await db.query('UPDATE carrinho SET car_qtd_item = ? WHERE car_id = ?', [qtd, car_id]);
        return resultado;
    } catch (err) {
        console.error("Erro no atualizarItensCarrinho - modelCarrinho: ${err}");
        throw err;
    }
}

async function buscarItemCarrinho(usr_id,lvr_id) {
    try {
        const [item] = await db.query('SELECT * FROM carrinho WHERE usuarios_usr_id = ? AND livros_lvr_id = ?',  [usr_id, lvr_id]);
        return item;
    } catch (err) {
        console.error("Erro no buscarItemCarrinho - modelCarrinho: ${err}");
        throw err;
    }
}

module.exports = {
    buscarItensCarrinho,
    deletarItensCarrinho,
    atualizarItensCarrinho,
    buscarItemCarrinho
};