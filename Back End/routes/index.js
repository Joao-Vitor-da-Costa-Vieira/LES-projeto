const express = require('express');
const usuarioRoutes = require('./usuarioRoutes');
const viewRoutes = require('./viewRoutes'); 

const router = express.Router();

router.use('/api', usuarioRoutes);

router.use('/', viewRoutes);

module.exports = router;