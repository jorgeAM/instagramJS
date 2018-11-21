const Sequelize = require('sequelize');
const db = require('../db/db');

const User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lastname: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  nickname: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  birthday: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      min: 6,
    },
  },
  avatar: {
    type: Sequelize.STRING,
    allowNull: true,
  },
}, {
  unique: true,
  fields: ['email'],
});

module.exports = User;
