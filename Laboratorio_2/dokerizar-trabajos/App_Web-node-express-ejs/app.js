const express = require('express');
const connection = require('./config/db');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));

// Mostrar usuarios
app.get('/', (req, res) => {
    connection.query('SELECT * FROM users', (err, results) => {
        if (err) throw err;
        res.render('index', { usuarios: results });
    });
});

// Agregar usuario
app.post('/add', (req, res) => {
    const { nombre, correo } = req.body;
    connection.query('INSERT INTO users (nombre, correo) VALUES (?, ?)', [nombre, correo], err => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Eliminar usuario
app.post('/delete/:id', (req, res) => {
    connection.query('DELETE FROM users WHERE id = ?', [req.params.id], err => {
        if (err) throw err;
        res.redirect('/');
    });
});

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
