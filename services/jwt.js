const jwt = require('jsonwebtoken');
const config = require('../config/config');

const getToken = (user) => {
  let payload = {
    id: user.id,
    name: user.name,
    lastname: user.lastname,
    nickname: user.nickname,
    birthday: user.birthday,
    email: user.email,
    avatar: user.avatar,
  };

  return jwt.sign(payload, config.app.jwt, { expiresIn: '1d' });
};

module.exports = {
  getToken,
};
