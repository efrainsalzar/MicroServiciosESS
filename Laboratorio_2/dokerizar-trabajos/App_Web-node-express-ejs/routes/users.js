   // routes/users.js
   const express = require('express');
   const router = express.Router();
   const db = require('../config/db');

   // Mostrar la lista de usuarios
   router.get('/', (req, res) => {
       db.query('SELECT * FROM users', (err, results) => {
           if (err) {
               console.error(err);
               return res.status(500).send('Error en la base de datos');
           }
           res.render('index', { users: results }); // Aquí se pasa 'users' a la vista
       });
   });

   // Agregar un nuevo usuario
   router.post('/add', (req, res) => {
       const { name, email } = req.body;
       db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], (err) => {
           if (err) {
               console.error(err);
               return res.status(500).send('Error en la base de datos');
           }
           res.redirect('/');
       });
   });

   // Eliminar un usuario
   router.post('/delete/:id', (req, res) => {
       const userId = req.params.id;
       db.query('DELETE FROM users WHERE id = ?', [userId], (err) => {
           if (err) {
               console.error(err);
               return res.status(500).send('Error en la base de datos');
           }
           res.redirect('/');
       });
   });

   module.exports = router;