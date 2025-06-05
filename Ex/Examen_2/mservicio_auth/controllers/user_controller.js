const db = require('../models/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { getUserByEmail } = require('../models/user_model');

const login = (req, res) => {
  const { correo, password } = req.body;

  getUserByEmail(correo, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    bcrypt.compare(password, user.password, (err, match) => {
      if (err || !match) {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }

      const token = jwt.sign({ userId: user.userId}, process.env.JWT_SECRET, {
        expiresIn: '2h',
      });

      res.json({ token });
    });
  });
};


const register = (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ message: 'Correo y contraseña son requeridos' });
  }

  // Verificar si ya existe un usuario con ese correo
  const checkQuery = 'SELECT * FROM usuarios WHERE correo = ?';
  db.query(checkQuery, [correo], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error en la base de datos' });
    if (results.length > 0) return res.status(409).json({ message: 'Correo ya registrado' });

    // Hashear la contraseña
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.status(500).json({ message: 'Error al encriptar contraseña' });

      const insertQuery = 'INSERT INTO usuarios (correo, password) VALUES (?, ?)';
      db.query(insertQuery, [correo, hashedPassword], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error al registrar usuario' });

        res.status(201).json({ message: 'Usuario registrado correctamente' });
      });
    });
  });
};

module.exports = { login, register };

