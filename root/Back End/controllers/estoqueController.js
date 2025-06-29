module.exports.getEstoque = async (req, res) => {

    try {
        res.render('estoque', {
        livros: livros || [],
        });
    } catch (error) {
        console.error(`Erro no getEstoque - controllerEstoque: ${err}`);
        res.sendStatus(500);
    }

};

module.exports.postEstoque = async (req, res) => {
    try {
        if (
            !req.body.entrada.est_quantidade || 
            !req.body.entrada.est_custo || 
            !req.body.entrada.est_fornecedor || 
            !req.body.entrada.livros_lvr_id
        ) {
            throw new Error("Todos os campos são obrigatórios!");
        }

        if (
            isNaN(req.body.entrada.est_quantidade) || 
            isNaN(req.body.entrada.est_custo) ||
            req.body.entrada.est_quantidade <= 0 ||
            req.body.entrada.est_custo <= 0
        ) {
            throw new Error("Quantidade e custo devem ser acima de zero!");
        }

        await entradaEstoque(req.body.entrada);

        res.sendStatus(200);
    } catch (error) {
        console.error(`Erro no postEstoque - controllerEstoque: ${err}`);
        res.sendStatus(500);
    }
};