const User = require('../models/user');
const Publication = require('../models/publication');

const migrate = async () => {
  try {
    Publication.belongsTo(User);
    User.hasMany(Publication);
    await User.sync();
    await Publication.sync();
  } catch (err) {
    console.log('Hubo un error: ', err);
  }
};

module.exports = migrate;
