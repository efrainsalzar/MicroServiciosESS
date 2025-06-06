const User = require("../models/user_model");
const generateToken = require("../middleware/generate_token");
const bcrypt = require("bcrypt");

// Mostrar todos los usuarios (sin passwords)
const getAllUsers = (req, res) => {
  // Consulta simple para obtener usuarios sin password_hash
  User.findAll((err, results) => {
    if (err) {
      console.error("Error al obtener usuarios:", err);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
    // Enviar solo datos públicos
    const users = results.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      created_at: u.created_at,
    }));
    res.json(users);
  });
};

// Registrar usuario nuevo
const registerUser = (req, res) => {
  const { name, email, password_hash, role } = req.body;

  // Validar campos obligatorios
  if ((!name || !email || !password_hash, !role)) {
    return res
      .status(400)
      .json({ message: "Name, email password_hash and role are required" });
  }

  // Aquí deberías hashear la contraseña (bcrypt)
  const bcrypt = require("bcrypt");
  const saltRounds = 10;

  bcrypt.hash(password_hash, saltRounds, (err, hash) => {
    if (err) {
      console.error("Error al hashear la contraseña:", err);
      return res
        .status(500)
        .json({ message: "Error interno al procesar contraseña" });
    }

    // Crear el usuario con password hash
    User.createUser(
      {
        name,
        email,
        password_hash: hash,
        role,
      },
      (err, result) => {
        if (err) {
          // Controlar error por email duplicado, etc
          console.error("Error al crear usuario:", err);
          return res
            .status(500)
            .json({ message: "No se pudo crear el usuario" });
        }
        res.status(201).json({
          message: "Usuario creado correctamente",
          id: result.insertId,
          name,
          email,
          role,
        });
      }
    );
  });
};


// Controlador de login
const loginUser = (req, res) => {
  const { email, password_hash } = req.body;

  if (!email || !password_hash) {
    return res
      .status(400)
      .json({ message: "Email y contraseña son requeridos" });
  }

  User.findUserByEmail(email, (err, results) => {
    if (err) {
      console.error("Error al buscar usuario:", err);
      return res.status(500).json({ message: "Error interno del servidor" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const user = results[0];

    bcrypt.compare(password_hash, user.password_hash, (err, isMatch) => {
      if (err) {
        console.error("Error al comparar contraseñas:", err);
        return res.status(500).json({ message: "Error interno" });
      }

      if (!isMatch) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }

      // Generar token
      const token = generateToken({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });

      res.json({
        message: "Login exitoso",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    });
  });
};

module.exports = {
  getAllUsers,
  registerUser,
  loginUser,
};
