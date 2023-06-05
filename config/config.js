require('dotenv').config();

module.exports = {
  environment: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  dbUri: process.env.DB_URI || 'mongodb://localhost/authentication-system',
  jwtEmailSecret: process.env.JWT_EMAIL_SECRET || 'mysecretkey0',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'mysecretkey1',
  jwtRefreshSecret: process.env.JWT_REFRESH_TOKEN || 'mysecretkey2',
  emailUser: process.env.EMAIL_USER || 'your_email@gmail.com',
  emailPassword: process.env.EMAIL_PASSWORD || 'your_email_password',
};
