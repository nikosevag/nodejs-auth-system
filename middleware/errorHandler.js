const config = require('../config/config');
function errorHandler(err, req, res, next) {
  console.log('ERROR HANDLER -> ' + err);
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: true,
      msg: 'Unauthorized',
      error: null,
    });
  }
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: true,
      msg: 'Unauthorized',
      error: null,
    });
  }
  if (config.environment === 'development') {
    return res.status(500).json({
      success: false,
      msg: 'Internal server error',
      name: err.name,
      message: err.message,
      error: err,
      stack: err.stack,
      source: 'Error Handler',
    });
  }

  return res.status(500).json({
    success: false,
    msg: 'Internal server error',
  });

  //   next();
}

module.exports = errorHandler;
