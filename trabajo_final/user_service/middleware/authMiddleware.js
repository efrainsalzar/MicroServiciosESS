// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // Obtener el token del header 'Authorization'
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Formato: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Acceso denegado. Token no proporcionado.",
    });
  }

  try {
    // Verificar el token usando tu secreto JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Adjuntar el usuario decodificado al objeto request
    req.user = decoded;

    // Continuar con el siguiente middleware o controlador
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Token inválido o expirado.",
    });
  }
};

module.exports = { verifyToken };
