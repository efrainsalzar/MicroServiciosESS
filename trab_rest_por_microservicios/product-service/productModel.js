const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize'); // <- BIEN: usa instancia centralizada

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
    timestamps: false,
    tableName: 'productos',
});

module.exports = Producto;
