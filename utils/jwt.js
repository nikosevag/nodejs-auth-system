const config = require('../config/config');
const jwt = require('jsonwebtoken');

exports.generateToken = (payload, expiresIn, type) => {
  let jwtSecret;

  if (type === 'access') {
    jwtSecret = config.jwtAccessSecret;
  }
  if (type === 'refresh') {
    jwtSecret = config.jwtRefreshSecret;
  }
  if (type === 'email') {
    jwtSecret = config.jwtEmailSecret;
  }

  return jwt.sign(payload, jwtSecret, {
    expiresIn: expiresIn,
  });
};
exports.verifyToken = (token, type) => {
  let jwtSecret;
  if (type === 'access') {
    jwtSecret = config.jwtAccessSecret;
  }
  if (type === 'refresh') {
    jwtSecret = config.jwtRefreshSecret;
  }
  if (type === 'email') {
    jwtSecret = config.jwtEmailSecret;
  }
  return jwt.verify(token, jwtSecret);
};
