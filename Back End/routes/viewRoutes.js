const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Front End/views/index.html'));
});

router.get('/cadastrarusuario', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Front End/views/cadastrarusuario.html'));
});

router.get('/cadastrar_end_cobranca', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Front End/views/cadastrar_end_cobranca.html'));
});

router.get('/cadastrar_end_entrega', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Front End/views/cadastrar_end_entrega.html'));
});

router.get('/cadastrar_cartao', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Front End/views/cadastrar_cartao.html'));
});

router.get('/consultarusuario', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Front End/views/consultarusuario.html'));
});

router.get('/atualizarusuario', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Front End/views/atualizarusuario.html'));
});

module.exports = router;