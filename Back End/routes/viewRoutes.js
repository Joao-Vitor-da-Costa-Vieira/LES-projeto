const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/cadastrarusuario', (req, res) => {
  res.render('cadastrarusuario');
});

router.get('/cadastrar_end_cobranca', (req, res) => {
  res.render('cadastrar_end_cobranca');
});

router.get('/cadastrar_end_entrega', (req, res) => {
  res.render('cadastrar_end_entrega');
});

router.get('/cadastrar_cartao', (req, res) => {
  res.render('cadastrar_cartao');
});

router.get('/consultarusuario', (req, res) => {
  res.render('consultarusuario');
});

router.get('/atualizarusuario', (req, res) => {
  res.render('atualizarusuario');
});

module.exports = router;