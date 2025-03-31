const { buscarUsuarioId } = require("../models/usuarioModel");

//Views
module.exports.getTela = (req, res) => {
    res.render('telaInicial');
};

module.exports.getHome = async (req, res) => {
    const usuario = await buscarUsuarioId(req.params.usr_id);
    console.log("Usuário retornado:", usuario);

    res.render('home',{
        usuario
    });
};