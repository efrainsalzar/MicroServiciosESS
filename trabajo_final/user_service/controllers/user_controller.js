const User = require("../models/user_model");
const generateToken = require("../middleware/generate_token");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// Función para mapear datos públicos del usuario
const mapUserToPublicData = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  created_at: user.created_at
});

// Controlador para obtener todos los usuarios (público)
const getAllUsers = async (req, res) => {
  try {
    const users = await new Promise((resolve, reject) => {
      User.findAll((err, results) => {
        if (err) reject(err);
        resolve(results.map(mapUserToPublicData));
      });
    });
    res.json(users);
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Controlador para registrar nuevo usuario
const registerUser = async (req, res) => {
  const { name, email, password_hash, role } = req.body;

  if (!name || !email || !password_hash || !role) {
    return res.status(400).json({ 
      message: "Todos los campos son requeridos: name, email, password y role" 
    });
  }

  try {
    const hash = await bcrypt.hash(password_hash, saltRounds);
    
    const result = await new Promise((resolve, reject) => {
      User.createUser({ name, email, password_hash: hash, role }, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });

    res.status(201).json({
      message: "Usuario creado correctamente",
      token: generateToken({ id: result.insertId, name, email, role }),
      user: { id: result.insertId, name, email, role }
    });
  } catch (err) {
    console.error("Error al registrar usuario:", err);
    
    const statusCode = err.code === 'ER_DUP_ENTRY' ? 409 : 500;
    const message = err.code === 'ER_DUP_ENTRY' 
      ? "El email ya está registrado" 
      : "Error al registrar usuario";

    res.status(statusCode).json({ message });
  }
};

// Controlador para login de usuario
const loginUser = async (req, res) => {
  const { email, password_hash } = req.body;

  if (!email || !password_hash) {
    return res.status(400).json({ message: "Email y contraseña son requeridos" });
  }

  try {
    const users = await new Promise((resolve, reject) => {
      User.findUserByEmail(email, (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });

    if (users.length === 0) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password_hash, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });

    res.json({
      message: "Login exitoso",
      token,
      user: mapUserToPublicData(user)
    });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Controlador para obtener usuarios (ruta privada)
const getAllUsersPrivate = async (req, res) => {
  try {
    const users = await new Promise((resolve, reject) => {
      User.findAll((err, results) => {
        if (err) reject(err);
        resolve(results.map(mapUserToPublicData));
      });
    });
    res.json(users);
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = {
  getAllUsers,
  registerUser,
  loginUser,
  getAllUsersPrivate
};