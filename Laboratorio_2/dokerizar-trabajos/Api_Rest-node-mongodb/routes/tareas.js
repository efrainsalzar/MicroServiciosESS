// routes/tareas.js
const express = require('express');
const router = express.Router();
const Tarea = require('../models/Tarea');

// GET /tareas - Obtener todas las tareas
router.get('/', async (req, res) => {
    try {
        const tareas = await Tarea.find();
        res.json(tareas);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /tareas - Crear una nueva tarea
router.post('/', async (req, res) => {
    const tarea = new Tarea({
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        estado: req.body.estado
    });

    try {
        const nuevaTarea = await tarea.save();
        res.status(201).json(nuevaTarea);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT /tareas/:id - Actualizar el estado de una tarea
router.put('/:id', async (req, res) => {
    try {
        const tarea = await Tarea.findById(req.params.id);
        if (!tarea) return res.status(404).json({ message: 'Tarea no encontrada' });

        tarea.estado = req.body.estado;
        const tareaActualizada = await tarea.save();
        res.json(tareaActualizada);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE /tareas/:id - Eliminar una tarea
router.delete('/:id', async (req, res) => {
    try {
        const tarea = await Tarea.findById(req.params.id);
        if (!tarea) return res.status(404).json({ message: 'Tarea no encontrada' });

        await tarea.remove();
        res.json({ message: 'Tarea eliminada' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;