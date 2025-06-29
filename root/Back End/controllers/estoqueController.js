module.exports.getEstoque = async (req, res) => {

    res.render('estoque', {
            livros: livros || [],
        });
};