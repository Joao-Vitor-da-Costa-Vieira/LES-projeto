const { buscarEstoqueLivro, atualizarEstoqueLivro, buscarCustoLivro, atualizarCustoLivro } = require("../models/livroModel");

const {entradaEstoque} = require("../models/estoqueModel");

module.exports.getEstoque = async (req, res) => {

    try {

        
        res.render('estoque', {
        livros: [],
        });
    } catch (error) {
        console.error(`Erro no getEstoque - controllerEstoque: ${error}`);
        res.sendStatus(500);
    }

};
module.exports.postEstoque = async (req, res) => {
    try {
        // Verificação dos campos obrigatórios (modificado)
        if (
            !req.body.est_quantidade || 
            !req.body.est_custo || 
            !req.body.est_fornecedor || 
            !req.body.livros_lvr_id
        ) {
            throw new Error("Todos os campos são obrigatórios!");
        }

        // Verificação dos valores numéricos (modificado)
        if (
            isNaN(req.body.est_quantidade) || 
            isNaN(req.body.est_custo) ||
            req.body.est_quantidade <= 0 ||
            req.body.est_custo <= 0
        ) {
            throw new Error("Quantidade e custo devem ser números acima de zero!");
        }

        const custoAtual = await buscarCustoLivro(req.body.livros_lvr_id);
        const estoqueAtual = await buscarEstoqueLivro(req.body.livros_lvr_id);

        // Atualiza custo se necessário
        if(custoAtual < req.body.est_custo){
            await atualizarCustoLivro(req.body.livros_lvr_id, req.body.est_custo);
        }

        // Calcula novo estoque
        const novoEstoque = estoqueAtual + Number(req.body.est_quantidade);
        await atualizarEstoqueLivro(req.body.livros_lvr_id, novoEstoque);

        // Cria objeto de entrada para o registro
        const entradaData = {
            est_quantidade: req.body.est_quantidade,
            est_custo: req.body.est_custo,
            est_fornecedor: req.body.est_fornecedor,
            est_data: req.body.est_data,
            livros_lvr_id: req.body.livros_lvr_id,
            // Adicione outros campos necessários aqui
        };

        await entradaEstoque(entradaData);

        res.sendStatus(200);
    } catch (error) {
        console.error(`Erro no postEstoque - controllerEstoque: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};