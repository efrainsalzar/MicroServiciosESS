const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

// Definir el modelo de Producto usando Sequelize
const Producto = sequelize.define('Producto', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.TEXT,
    },
    marca: {
        type: DataTypes.STRING,
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    timestamps: false, // No necesitamos los campos `createdAt` y `updatedAt`
    tableName: 'productos', // Nombre de la tabla en la base de datos
});

// Sincronizar el modelo con la base de datos
/*Producto.sync()
  .then(() => console.log('Modelo "Producto" sincronizado con la base de datos.'))
  .catch((err) => console.error('Error al sincronizar el modelo:', err));
*/
module.exports = Producto;
