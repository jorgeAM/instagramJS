const Sequelize = require('sequelize');
const db = require('../db/db');

const Publication = db.define('publication', {
  body: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  image: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

module.exports = Publication;
