const moment = require('moment');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const jwtMiddleware = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: 'Debes iniciar sesión' });
  }

  let token = req.headers.authorization;
  token = token.replace('Bearer ', '');
  try {
    let payload = jwt.verify(token, config.app.jwt);
    if (moment().unix() >= payload.exp) {
      return res.status(401).json({ message: 'Token ha expirado' });
    }

    req.auth = payload;
  } catch (e) {
    return res.status(500).json({ message: 'Token inválido' });
  }

  next();
};

module.exports = jwtMiddleware;
