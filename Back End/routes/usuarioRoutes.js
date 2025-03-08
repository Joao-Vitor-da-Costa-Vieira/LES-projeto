const express = require('express');
const router = express.Router();

// Rota GET /usuario
router.get('/usuario', (req, res) => {
  res.send('Rota /usuario funcionando!');
});

module.exports = router;