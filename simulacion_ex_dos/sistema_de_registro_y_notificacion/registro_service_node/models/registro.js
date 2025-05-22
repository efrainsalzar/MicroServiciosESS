const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Registro = sequelize.define('Registro', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  }
}, {
  tableName: 'registro',
  timestamps: false // si no usas createdAt/updatedAt
});

module.exports = Registro;
