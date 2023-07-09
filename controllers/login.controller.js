const bcrypt = require('bcrypt');
const User = require('../models/User');
const errorHandler = require('../middleware/errorHandler');
const { generateToken, verifyToken } = require('../utils/jwt');

// Login user
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username and password are filled
    if (!username || !password) {
      return res.status(400).json({
        success: true,
        msg: 'Please fill your credentials to login',
        error: null,
      });
    }

    // Find the user by username or email
    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    });
    // If no user found
    if (!user) {
      return res.status(400).json({
        success: true,
        msg: 'Invalid username or password',
        error: null,
      });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: true,
        msg: 'Invalid username or password',
        error: null,
      });
    }

    // Check if the email is verified
    if (!user.isVerified) {
      return res.status(400).json({
        success: true,
        msg: 'Email not verified. Please verify your email first to login to your account using the link sent to your email address.',
        error: null,
      });
    }

    // Generate a JWT token
    const accessToken = generateToken(
      {
        userId: user._id,
      },
      '1h',
      'access'
    );

    const refreshToken = generateToken(
      {
        userId: user._id,
      },
      '7d',
      'refresh'
    );

    return res.json({
      success: true,
      msg: 'Logged in successfully!',
      accessToken,
      refreshToken,
      error: null,
    });
  } catch (err) {
    errorHandler(err, req, res);
  }
};

// Refresh access token
exports.refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({
        success: true,
        msg: 'No refresh token provided',
        error: null,
      });
    }

    // Verify the refresh token
    const decodedToken = verifyToken(refreshToken, 'refresh');
    const userId = decodedToken.userId;

    const correctSecretKey = await User.findOne({
      $and: [{ _id: userId }],
    });

    // Check if the user exists
    if (!correctSecretKey) {
      return res.status(401).json({
        success: true,
        msg: 'Invalid refresh token or secret key',
        error: null,
      });
    }

    // Generate a new access token
    const accessToken = generateToken(
      {
        userId: userId,
      },
      '1h',
      'access'
    );

    return res.json({
      success: true,
      msg: 'Access token refreshed successfully',
      accessToken,
      error: null,
    });
  } catch (err) {
    errorHandler(err, req, res);
  }
};
