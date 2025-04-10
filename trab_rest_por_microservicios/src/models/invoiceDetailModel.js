const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Factura = require('./invoiceModel');  // Importa el modelo de facturas
const Producto = require('./productModel'); // Importa el modelo de productos

const DetalleFactura = sequelize.define('DetalleFactura', {
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
},
{
  timestamps: false, // No usar timestamps si no se requiere
  tableName: 'detalles_factura', // Nombre de la tabla en la base de datos
});

// Definir las relaciones
DetalleFactura.belongsTo(Factura, { foreignKey: 'factura_id' });
DetalleFactura.belongsTo(Producto, { foreignKey: 'producto_id' });

module.exports = DetalleFactura;
