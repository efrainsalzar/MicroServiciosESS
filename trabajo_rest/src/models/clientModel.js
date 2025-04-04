const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');  // Ruta al archivo de configuración de DB

// Definir el modelo de Cliente usando Sequelize
const Cliente = sequelize.define('Cliente', {
  ci: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  nombres: {
    type: DataTypes.STRING,
    allowNull: false
  },
  apellidos: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sexo: {
    type: DataTypes.ENUM('M', 'F'),
    allowNull: false
  }
}, {
    timestamps: false,       // No usar timestamps si no se requiere
    tableName: 'clientes',  // Nombre de la tabla en la base de datos
});

// Sincronizar el modelo con la base de datos
/*Cliente.sync()
  .then(() => console.log('Modelo "Cliente" sincronizado con la base de datos.'))
  .catch((err) => console.error('Error al sincronizar el modelo:', err));
*/
module.exports = Cliente;
