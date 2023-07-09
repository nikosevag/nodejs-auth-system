const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const uuid = require('uuid');
const config = require('../config/config');
const User = require('../models/User');

const errorHandler = require('../middleware/errorHandler');
const { generateToken, verifyToken } = require('../utils/jwt');

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: true,
        msg: 'Please enter your email',
        error: null,
      });
    }

    // Check if user with email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: true,
        msg: 'If the email you entered is registered with us, you will receive a password reset link shortly. Please check your email. The link will expire in 10 minutes.',
        error: null,
      });
    }

    // Generate a JWT token with expiration time of 10 minutes
    const token = generateToken(
      {
        userId: user._id,
        email: user.email,
      },
      '10m',
      'email'
    );

    // Send password reset link
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.emailUser,
        pass: config.emailPassword,
      },
    });

    const mailOptions = {
      from: config.emailUser,
      to: email,
      subject: 'Password Reset',
      html: `
        <h3>Hello ${user.username}!</h3>
        <p>You have requested to reset your password. Please click on the following link to reset your password:</p>
        <a href="${req.headers.origin}/reset-password/${token}">${req.headers.origin}/reset-password/${token}</a>
        <p>If you did not request this password reset, please ignore this email.</p>
      `,
    };

    // Send the email
    // ! Comment out the following line if you don't want to send an email to the user for testing purposes
    // await transporter.sendMail(mailOptions);

    // Success response
    return res.status(200).json({
      success: true,
      msg: 'If the email you entered is registered with us, you will receive a password reset link shortly. Please check your email. The link will expire in 10 minutes.',
      error: null,
      msg_for_testing: `/reset-password/${token}`,
    });
  } catch (err) {
    errorHandler(err, req, res);
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        msg: 'Please enter a new password',
        error: null,
      });
    }
    if (!token) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid or expired password reset token',
        error: null,
      });
    }

    // Verify the token
    const payload = verifyToken(token, 'email');

    console.log(payload);

    // Find the user associated with the token
    const user = await User.findById(payload.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: 'User not found',
        error: null,
      });
    }

    // Hash the new password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Save the new password to the user in the database
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      msg: 'Password reset successfully. You can now login with your new password.',
      error: null,
    });
  } catch (err) {
    errorHandler(err, req, res);
  }
};
