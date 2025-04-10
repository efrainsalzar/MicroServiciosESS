const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Cliente = require('./clientModel'); // Importa el modelo de clientes

const Factura = sequelize.define('Factura', {
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  cliente_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Cliente,
      key: 'id',
    },
  },
},
{
  timestamps: false, // No usar timestamps si no se requiere
  tableName: 'facturas', // Nombre de la tabla en la base de datos
});

module.exports = Factura;
