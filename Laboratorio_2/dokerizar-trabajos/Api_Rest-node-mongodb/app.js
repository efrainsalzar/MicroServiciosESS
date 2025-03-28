const express = require('express');
const mongoose = require('mongoose');
const Tarea = require('./models/Tarea');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Para parsear el cuerpo de las peticiones como JSON

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.log('Error de conexión a MongoDB:', err));

// Endpoints de la API
app.get('/tareas', async (req, res) => {
  try {
    const tareas = await Tarea.find();
    res.json(tareas);
  } catch (err) {
    res.status(500).json({ error: 'No se pudieron obtener las tareas' });
  }
});

app.post('/tareas', async (req, res) => {
  try {
    const { titulo, descripcion } = req.body;
    const nuevaTarea = new Tarea({ titulo, descripcion });
    await nuevaTarea.save();
    res.status(201).json(nuevaTarea);
  } catch (err) {
    res.status(400).json({ error: 'Error al crear tarea' });
  }
});

app.put('/tareas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const tareaActualizada = await Tarea.findByIdAndUpdate(id, { estado }, { new: true });
    if (!tareaActualizada) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    res.json(tareaActualizada);
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar la tarea' });
  }
});

app.delete('/tareas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const tareaEliminada = await Tarea.findByIdAndDelete(id);
    if (!tareaEliminada) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    res.json({ message: 'Tarea eliminada con éxito' });
  } catch (err) {
    res.status(400).json({ error: 'Error al eliminar la tarea' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
