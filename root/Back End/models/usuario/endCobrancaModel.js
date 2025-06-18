const db = require('../config/db');

async function cadastrarEnderecoCobranca(dados) {

    const sql = `INSERT INTO enderecos_cobranca (
        usuario_usr_id, 
        end_endereco, 
        end_numero, 
        end_bairro, 
        end_cidade, 
        end_estado, 
        end_cep, 
        end_complemento
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const valores = [
        dados.end_usr_id,
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
        console.error(`Erro no cadastrarEnderecoCobranca - modelEndereco: ${err}`);
        throw err;
    }
}

async function atualizarEnderecoCobranca(dados, end_id) {
    const campos = Object.keys(dados).map(key => `${key} = ?`).join(', ');
    let valores = Object.values(dados);
    valores.push(end_id);

    const sql = `UPDATE enderecos_cobranca SET ${campos} WHERE end_id = ?`;

    try {
        const [endereco] = await db.query(sql, valores);
        return endereco;
    } catch (err) {
        console.error(`Erro no atualizarEnderecoCobranca - modelEndereco: ${err}`);
        throw err;
    }
}

async function buscarTodosEnderecosCobranca() {
    try {
        const [enderecos] = await db.query('SELECT * FROM enderecos_cobranca');
        return enderecos;
    } catch (err) {
        console.error(`Erro no buscarTodosEnderecosCobranca - modelEndereco: ${err}`);
        throw err;
    }
}

async function buscarEnderecoCobrancaId(id) {
    try {
        const [endereco] = await db.query(`SELECT * FROM enderecos_cobranca WHERE end_id = ?`, id);
        return endereco;
    } catch (err) {
        console.error(`Erro no buscarEnderecoCobrancaId - modelEndereco: ${err}`);
        throw err;
    }
}

async function buscarEnderecosCobrancaUsuarioId(id) {
    try {
        const [enderecos] = await db.query(`SELECT * FROM enderecos_cobranca WHERE usuario_usr_id = ?`, id);
        return enderecos;
    } catch (err) {
        console.error(`Erro no buscarEnderecosCobrancaUsuarioId - modelEndereco: ${err}`);
        throw err;
    }
}

module.exports = {
    cadastrarEnderecoCobranca,
    atualizarEnderecoCobranca,
    buscarTodosEnderecosCobranca,
    buscarEnderecoCobrancaId,
    buscarEnderecosCobrancaUsuarioId
};