// INSERT

// Cadastrando um novo endereço de entrega no banco de dados
async function cadastrarEnderecoEntrega(dados) {
    // Consulta SQL
    const sql = `INSERT INTO enderecos_entrega (
        usuario_usr_id, 
        end_endereco, 
        end_numero, 
        end_bairro, 
        end_cidade, 
        end_estado, 
        end_cep, 
        end_complemento
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    // Valores a serem inseridos no banco
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
        console.error(`Erro no cadastrarEnderecoEntrega - modelEndereco: ${err}`);
        throw err;
    }
}

// UPDATE

// Atualizando os endereços de entrega no banco de dados
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

// SELECT

// Buscando todos os endereços de entrega do banco de dados
async function buscarTodosEnderecosEntrega() {
    try {
        const [enderecos] = await db.query('SELECT * FROM enderecos_entrega');
        return enderecos;
    } catch (err) {
        console.error(`Erro no buscarTodosEnderecosEntrega - modelEndereco: ${err}`);
        throw err;
    }
}

// Buscando endereço de entrega por id
async function buscarEnderecoEntregaId(id) {
    try {
        const [endereco] = await db.query(`SELECT * FROM enderecos_entrega WHERE end_id = ?`, id);
        return endereco;
    } catch (err) {
        console.error(`Erro no buscarEnderecoEntregaId - modelEndereco: ${err}`);
        throw err;
    }
}

// Buscando endereços de entrega por id de usuário
async function buscarEnderecosEntregaUsuarioId(id) {
    try {
        const [enderecos] = await db.query(`SELECT * FROM enderecos_entrega WHERE end_usr_id = ?`, id);
        return enderecos;
    } catch (err) {
        console.error(`Erro no buscarEnderecosEntregaUsuarioId - modelEndereco: ${err}`);
        throw err;
    }
}

// Exportando as funções
module.exports = {
    cadastrarEnderecoEntrega,
    atualizarEnderecoEntrega,
    buscarTodosEnderecosEntrega,
    buscarEnderecoEntregaId,
    buscarEnderecosEntregaUsuarioId
};