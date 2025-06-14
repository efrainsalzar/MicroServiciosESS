const fs = require("fs");
const path = require("path");

const logPath = path.join(__dirname, "app.log");

function logEvent(message, user = "anon", ip = "localhost") {
  const timestamp = new Date().toISOString();
  const line = `${timestamp} | ${ip} | ${user} | ${message}\n`;
  fs.appendFileSync(logPath, line);
}

module.exports = { logEvent };
