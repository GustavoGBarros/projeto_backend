const { DataTypes } = require('sequelize');
const { sequelize } = require('../Config/dbRelacional');

const Conhecimento = sequelize.define('Conhecimento', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'conhecimentos',
  timestamps: false
});

Conhecimento.sync();

module.exports = Conhecimento;