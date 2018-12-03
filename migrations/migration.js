const User = require('../models/user');
const Publication = require('../models/publication');
const Comment = require('../models/comment');

const migrate = async () => {
  try {
    /*RELACIONES*/
    Publication.belongsTo(User);
    Comment.belongsTo(User);
    Comment.belongsTo(Publication);
    User.hasMany(Publication);
    User.hasMany(Comment);
    Publication.hasMany(Comment);

    // User.belongsToMany(User, {
    //   as: 'Children',
    //   through: 'UserChildren',
    // });

    /*CREACIÓN DE TABLAS*/
    await User.sync();
    await Publication.sync();
    await Comment.sync();
  } catch (err) {
    console.log('Hubo un error: ', err);
  }
};

module.exports = migrate;
