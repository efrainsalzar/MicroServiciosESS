const User = require("../models/user_model"); // Your promise-based model
const generateToken = require("../middleware/generate_token");
const { logEvent } = require("../logs/logger");

const bcrypt = require("bcrypt");
const saltRounds = 10;

// Función para mapear datos públicos del usuario
const mapUserToPublicData = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  created_at: user.created_at,
});

// Controlador para obtener todos los usuarios (público)
const getAllUsers = async (req, res) => {
  try {
    // Await directamente la llamada al modelo, ya que devuelve una promesa
    const users = await User.findAll();
    // Mapea los resultados para mostrar solo datos públicos
    res.json(users.map(mapUserToPublicData));
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

//Controlador para obtener un usuario por ID (público)
const getUserById = async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    return res.status(400).json({ message: "ID de usuario es requerido" });
  }
  try {
    // Await directamente la llamada al modelo, ya que devuelve una promesa
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    // Mapea el usuario a datos públicos
    res.json(mapUserToPublicData(user));
  } catch (err) {
    console.error("Error al obtener usuario por ID:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Controlador para registrar nuevo usuario
const registerUser = async (req, res) => {
  const { name, email, password_hash, role } = req.body;

  if (!name || !email || !password_hash || !role) {
    return res.status(400).json({
      message: "Todos los campos son requeridos: name, email, password y role",
    });
  }

  try {
    const hash = await bcrypt.hash(password_hash, saltRounds);

    // Await directamente la llamada al modelo, ya que devuelve una promesa
    // El método createUser en el modelo ya maneja la inserción y devuelve el ID
    const newUserId = await User.createUser({
      name,
      email,
      password_hash: hash,
      role,
    });
    // logs
    logEvent("Registro exitoso", email, req.ip);

    res.status(201).json({
      message: "Usuario creado correctamente",
      token: generateToken({ id: newUserId, name, email, role }), // Usa newUserId aquí
      user: { id: newUserId, name, email, role }, // Usa newUserId aquí
    });
  } catch (err) {
    console.error("Error al registrar usuario:", err);

    // El modelo ya lanza errores para validaciones, puedes capturarlos aquí
    if (err.message && err.message.includes("Invalid")) {
      // Specific check for validation errors from model
      return res.status(400).json({ message: err.message });
    }

    // Para errores de base de datos como duplicados
    const statusCode = err.code === "ER_DUP_ENTRY" ? 409 : 500;
    const message =
      err.code === "ER_DUP_ENTRY"
        ? "El email ya está registrado"
        : "Error al registrar usuario";

    res.status(statusCode).json({ message });
  }
};

// Controlador para login de usuario
const loginUser = async (req, res) => {
  const { email, password_hash } = req.body;

  if (!email || !password_hash) {
    return res
      .status(400)
      .json({ message: "Email y contraseña son requeridos" });
  }

  try {
    // Await directamente la llamada al modelo, ya que devuelve una promesa
    const user = await User.findUserByEmail(email); // El modelo ya devuelve el primer usuario o undefined

    if (!user) {
      // Comprueba si el usuario existe
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const isMatch = await bcrypt.compare(password_hash, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    logEvent("Inicio de sesión exitoso", email, req.ip);

    res.json({
      message: "Login exitoso",
      token,
      user: mapUserToPublicData(user),
    });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Controlador para obtener usuarios (ruta privada)
const getAllUsersPrivate = async (req, res) => {
  try {
    // Await directamente la llamada al modelo, ya que devuelve una promesa
    const users = await User.findAll();
    // Mapea los resultados para mostrar solo datos públicos
    res.json(users.map(mapUserToPublicData));
  } catch (err) {
    console.error("Error al obtener usuarios (privada):", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  registerUser,
  loginUser,
  getAllUsersPrivate,
};
