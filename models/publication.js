const Sequelize = require('sequelize');
const db = require('../db/db');
const User = require('./user');

const Publication = db.define('publication', {
  body: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  image: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  userId: {
    type: Sequelize.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
});

module.exports = Publication;
