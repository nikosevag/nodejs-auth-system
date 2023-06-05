const express = require('express');
const {
  register,
  sendVerificationEmailAgain,
  verifyEmail,
} = require('../controllers/register.controller');

const {
  login,
  refreshAccessToken,
} = require('../controllers/login.controller');

const {
  forgotPassword,
  resetPassword,
} = require('../controllers/forgotPassword.controller');

const { protected } = require('../controllers/protected.controller');

const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

// Register user
router.post('/register', register);

// Send verification email again
router.post('/register/verify-again', sendVerificationEmailAgain);

// Verify email
router.get('/register/verify-email/:token', verifyEmail);

// Login user
router.post('/login', login);

// Refresh token
router.post('/login/refresh-token', refreshAccessToken);

// Forgot password
router.post('/forgot-password/send-email', forgotPassword);

// Reset password
router.post('/forgot-password/reset-password/:token', resetPassword);

// Protected route
router.get('/protected', authenticate, protected);

module.exports = router;
