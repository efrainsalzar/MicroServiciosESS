// middlewares/generate_token.js
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  // Clave secreta desde variable de entorno o valor por defecto
  const secret = process.env.JWT_SECRET;

  // Opciones del token
  const options = {
    expiresIn: "24h", // Token válido por 24 horas
  };

  return jwt.sign(payload, secret, options);
};

module.exports = generateToken;
