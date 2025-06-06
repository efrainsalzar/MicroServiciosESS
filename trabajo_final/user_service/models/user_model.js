// user_model.js
const db = require("../config/db"); // Make sure this path is correct for your promise-based pool

const User = {
  // It's common to export an object or a class for models
  createUser: async (user) => {
    // Basic validations
    if (!user.name || user.name.trim().length < 3) {
      throw new Error("Invalid name (min 3 characters).");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!user.email || !emailRegex.test(user.email)) {
      throw new Error("Invalid email format.");
    }

    const sql = `
      INSERT INTO users (name, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `;
    try {
      // db.query from the promise pool returns a tuple: [rows, fields]
      const [result] = await db.query(sql, [
        user.name,
        user.email,
        user.password_hash,
        user.role,
      ]);
      return result.insertId; // Returns the ID of the newly inserted row
    } catch (error) {
      console.error("Error creating user in model:", error);
      throw error; // Re-throw the error to be caught by the controller
    }
  },

  findAll: async () => {
    const sql = "SELECT id, name, email, role, created_at FROM users";
    try {
      const [rows] = await db.query(sql);
      return rows; // Returns the array of users
    } catch (error) {
      console.error("Error finding all users in model:", error);
      throw error;
    }
  },

  findUserByEmail: async (email) => {
    try {
      const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
        email,
      ]);
      return rows[0]; // Returns the first user found or undefined
    } catch (error) {
      console.error("Error finding user by email in model:", error);
      throw error;
    }
  },
};

module.exports = User; // Export the User object
