const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const Agenda = require('./models/agenda');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// 📌 Obtener todos los registros
app.get('/agenda', async (req, res) => {
    try {
        const registros = await Agenda.find();
        res.json(registros);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los datos' });
    }
});

// 📌 Obtener un registro por ID
app.get('/agenda/:id', async (req, res) => {
    try {
        const registro = await Agenda.findById(req.params.id);
        if (!registro) {
            return res.status(404).json({ error: 'Registro no encontrado' });
        }
        res.json(registro);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el registro' });
    }
});

// 📌 Crear un nuevo registro
app.post('/agenda', async (req, res) => {
    try {
        const nuevoRegistro = new Agenda(req.body);
        await nuevoRegistro.save();
        res.status(201).json({ message: 'Registro creado', data: nuevoRegistro });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al insertar el registro' });
    }
});

// 📌 Actualizar un registro
app.put('/agenda/:id', async (req, res) => {
    try {
        const registroActualizado = await Agenda.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!registroActualizado) {
            return res.status(404).json({ error: 'Registro no encontrado' });
        }
        res.json({ message: 'Registro actualizado', data: registroActualizado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el registro' });
    }
});

// 📌 Eliminar un registro
app.delete('/agenda/:id', async (req, res) => {
    try {
        const registroEliminado = await Agenda.findByIdAndDelete(req.params.id);
        if (!registroEliminado) {
            return res.status(404).json({ error: 'Registro no encontrado' });
        }
        res.json({ message: 'Registro eliminado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el registro' });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
