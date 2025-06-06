const db = require('../config/db');

const createUser = (user, callback) => {
  // Validaciones básicas
  if (!user.name || user.name.trim().length < 3) {
    return callback(new Error('Invalid name (min 3 characters).'));
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!user.email || !emailRegex.test(user.email)) {
    return callback(new Error('Invalid email format.'));
  }

  const sql = `
    INSERT INTO users (name, email, password_hash, role)
    VALUES (?, ?, ?, ?)
  `;
  db.query(sql, [user.name, user.email, user.password_hash, user.role], callback);
};

const findAll = (callback) => {
  const sql = 'SELECT id, name, email, role, created_at FROM users';
  db.query(sql, callback);
};


const findUserByEmail = (email, callback) => {
  db.query('SELECT * FROM users WHERE email = ?', [email], callback);
};

module.exports = {
  createUser,
  findAll,
  findUserByEmail
};
