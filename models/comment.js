const Sequelize = require('sequelize');
const db = require('../db/db');
const User = require('./user');
const Publication = require('./publication');

const Comment = db.define('comment', {
  body: {
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
  publicationId: {
    type: Sequelize.INTEGER,
    references: {
      model: Publication,
      key: 'id',
    },
  },
});

module.exports = Comment;
