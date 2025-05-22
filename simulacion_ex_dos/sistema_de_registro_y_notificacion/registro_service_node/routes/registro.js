const express = require('express');
const router = express.Router();

const { crearRegistro, mostrarRegistros } = require('../controllers/registro');

router.get('/', mostrarRegistros);
router.post('/', crearRegistro);

module.exports = router;
