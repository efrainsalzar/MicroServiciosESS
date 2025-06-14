const fs = require("fs");
const path = require("path");

const logFilePath = path.join(__dirname, "app.log");

// Asegurar que el archivo y carpeta existen
const logDir = path.dirname(logFilePath);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}
if (!fs.existsSync(logFilePath)) {
  fs.writeFileSync(logFilePath, "");
}

function logEvent(message, username = "Sistema", ip = "N/A") {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${username}] [${ip}] ${message}\n`;

  try {
    fs.appendFileSync(logFilePath, logEntry);
  } catch (err) {
    console.error("Error al escribir en log:", err);
  }
}

module.exports = { logEvent };
