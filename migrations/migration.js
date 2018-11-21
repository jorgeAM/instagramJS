const User = require('../models/user');

const migrate = async () => {
  try {
    await User.sync();
  } catch (err) {
    console.log('Hubo un error: ', err);
  }
};

module.exports = migrate;
