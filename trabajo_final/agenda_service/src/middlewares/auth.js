const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const auth = (req) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded; // Esto lo inyectas como context.user
  } catch (err) {
    return null; // Devuelve null si falla el token (no lanza error aquí)
  }
};

module.exports = auth;
