const db = require('../../config/db');

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
        const [result] = await db.query(
            "SELECT usuarios_usr_id FROM carrinho WHERE car_id = ?", 
            [car_id]
        );
        
        if (result.length === 0) {
            throw new Error('Item do carrinho não encontrado');
        }
        
        const usr_id = result[0].usuarios_usr_id;
        
        // Depois deleta o item
        await db.query(
            'DELETE FROM carrinho WHERE car_id = ?',
            [car_id]
        );
        
        return usr_id;
    } catch (err) {
        console.error(`Erro no deletarItensCarrinho - modelCarrinho: ${err}`);
        throw err;
    }
}

async function adicionarItemCarrinho(usr_id, lvr_id, qtd) {
    try {
        const [livro] = await db.query('SELECT lvr_qtd_estoque FROM livros WHERE lvr_id = ?', [lvr_id]);
        
        if (livro.length === 0) {
            throw new Error('Livro não encontrado');
        }
        
        const estoqueDisponivel = livro[0].lvr_qtd_estoque;
        
        if (qtd > estoqueDisponivel) {
            throw new Error(`Quantidade solicitada (${qtd}) excede o estoque disponível (${estoqueDisponivel})`);
        }
        
        const [itemExistente] = await db.query(
            'SELECT * FROM carrinho WHERE usuarios_usr_id = ? AND livros_lvr_id = ?',
            [usr_id, lvr_id]
        );
        
        if (itemExistente.length > 0) {
            const novaQtd = itemExistente[0].car_qtd_item + qtd;
            if (novaQtd > estoqueDisponivel) {
                throw new Error(`Quantidade total no carrinho (${novaQtd}) excederia o estoque disponível (${estoqueDisponivel})`);
            }
            await db.query(
                'UPDATE carrinho SET car_qtd_item = ? WHERE car_id = ?',
                [novaQtd, itemExistente[0].car_id]
            );
        } else {
            await db.query(
                "INSERT INTO carrinho (car_qtd_item, usuarios_usr_id, livros_lvr_id) VALUES (?, ?, ?)",
                [qtd, usr_id, lvr_id]
            );
        }
        
        return { success: true, message: 'Item adicionado ao carrinho com sucesso' };
    } catch (err) {
        console.error(`Erro no adicionarItemCarrinho - modelCarrinho: ${err}`);
        throw err;
    }
}

async function alterarItemCarrinho(usr_id, lvr_id, qtd) {
    try {
        const [livro] = await db.query('SELECT lvr_qtd_estoque FROM livros WHERE lvr_id = ?', [lvr_id]);
        
        if (livro.length === 0) {
            throw new Error('Livro não encontrado');
        }
        
        const estoqueDisponivel = livro[0].lvr_qtd_estoque;
        
        if (qtd > estoqueDisponivel) {
            throw new Error(`Quantidade solicitada (${qtd}) excede o estoque disponível (${estoqueDisponivel})`);
        }
        
        const [itemExistente] = await db.query(
            'SELECT * FROM carrinho WHERE usuarios_usr_id = ? AND livros_lvr_id = ?',
            [usr_id, lvr_id]
        );
        
        if (itemExistente.length === 0) {
            throw new Error('Item não encontrado no carrinho');
        }
        
        await db.query(
            'UPDATE carrinho SET car_qtd_item = ? WHERE car_id = ?',
            [qtd, itemExistente[0].car_id]
        );
        
        const [itens] = await db.query('SELECT * FROM carrinho WHERE usuarios_usr_id = ?', [usr_id]);
        return itens;
    } catch (err) {
        console.error(`Erro no alterarItemCarrinho - modelCarrinho: ${err}`);
        throw err;
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

async function limparCarrinhoUsuario(usuarioId) {
    await db.query('DELETE FROM carrinho WHERE usuarios_usr_id = ?', [usuarioId]);
}

module.exports = {
    buscarItensCarrinho,
    deletarItensCarrinho,
    buscarItemCarrinho,
    alterarItemCarrinho,
    adicionarItemCarrinho,
    limparCarrinhoUsuario
};