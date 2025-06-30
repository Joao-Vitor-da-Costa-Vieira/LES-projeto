const db = require('../../config/db');

async function cadastrarEnderecoEntrega(dados) {
    const sql = `INSERT INTO enderecos_entrega (
        usuarios_usr_id, 
        end_endereco, 
        end_numero, 
        end_bairro, 
        end_cidade, 
        end_estado, 
        end_cep, 
        end_complemento
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const valores = [
        dados.usuarios_usr_id,
        dados.end_endereco,
        dados.end_numero,
        dados.end_bairro,
        dados.end_cidade,
        dados.end_estado,
        dados.end_cep,
        dados.end_complemento
    ];

    try {
        await db.query(sql, valores);
    } catch (err) {
        console.error(`Erro no cadastrarEnderecoEntrega - modelEndereco: ${err}`);
        throw err;
    }
}

async function atualizarEnderecoEntrega(dados, end_id) {
    const campos = Object.keys(dados).map(key => `${key} = ?`).join(', ');
    let valores = Object.values(dados);
    valores.push(end_id);

    const sql = `UPDATE enderecos_entrega SET ${campos} WHERE end_id = ?`;

    try {
        const [endereco] = await db.query(sql, valores);
        return endereco;
    } catch (err) {
        console.error(`Erro no atualizarEnderecoEntrega - modelEndereco: ${err}`);
        throw err;
    }
}

async function buscarTodosEnderecosEntrega() {
    try {
        const [enderecos] = await db.query('SELECT * FROM enderecos_entrega');
        return enderecos;
    } catch (err) {
        console.error(`Erro no buscarTodosEnderecosEntrega - modelEndereco: ${err}`);
        throw err;
    }
}

async function buscarEnderecoEntregaId(id) {
    try {
        const [endereco] = await db.query(`SELECT * FROM enderecos_entrega WHERE end_id = ?`, [id]);
        return endereco;
    } catch (err) {
        console.error(`Erro no buscarEnderecoEntregaId - modelEndereco: ${err}`);
        throw err;
    }
}

async function buscarEnderecosEntregaUsuarioId(id) {
    try {
        const [enderecos] = await db.query(`SELECT * FROM enderecos_entrega WHERE usuarios_usr_id = ?`, [id]);
        return enderecos;
    } catch (err) {
        console.error(`Erro no buscarEnderecosEntregaUsuarioId - modelEndereco: ${err}`);
        throw err;
    }
}

async function buscarEnderecoEntregaPorTransacao(tra_id) {
    const [endereco] = await db.query(
        `SELECT
            e.end_id, 
            e.end_endereco,
            e.end_numero,
            e.end_complemento,
            e.end_bairro,
            e.end_cidade,
            e.end_estado,
            e.end_cep
        FROM transacoes t
        INNER JOIN enderecos_entrega e ON t.enderecos_entrega_end_id = e.end_id
        WHERE t.tra_id = ?`,
        [tra_id]
    );
    return endereco[0];
}

// Exportando as funções
module.exports = {
    cadastrarEnderecoEntrega,
    atualizarEnderecoEntrega,
    buscarTodosEnderecosEntrega,
    buscarEnderecoEntregaId,
    buscarEnderecosEntregaUsuarioId,
    buscarEnderecoEntregaPorTransacao
};