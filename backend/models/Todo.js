const { DataTypes } = require('sequelize');
const sequelize = require('../db');


const Todo = sequelize.define('Todo', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  task: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  tableName: 'todos', 
  timestamps: true  
});

module.exports = Todo;
