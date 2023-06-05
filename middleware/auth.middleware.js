const errorHandler = require('./errorHandler');
const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

// Middleware to verify JWT token
exports.authenticate = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      success: true,
      msg: 'Unauthorized',
      error: null,
    });
  }

  try {
    const decodedToken = verifyToken(token, 'access');
    const userId = decodedToken.userId;

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(401).json({
        success: true,
        msg: 'Unauthorized',
        error: null,
      });
    }

    req.user = {
      user,
    };

    next();
  } catch (err) {
    errorHandler(err, req, res, next);
  }
};
