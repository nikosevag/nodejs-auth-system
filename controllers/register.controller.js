const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const uuid = require('uuid');
const config = require('../config/config');
const User = require('../models/User');
const errorHandler = require('../middleware/errorHandler');
const { generateToken, verifyToken } = require('../utils/jwt');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if all fields are filled
    if (!username || !email || !password) {
      // 400
      return res.status(400).json({
        success: true,
        msg: 'Please fill all fields',
        error: null,
      });
    }

    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      // 409
      return res.status(409).json({
        success: true,
        msg: 'Username or email already exists',
        error: null,
      });
    }

    // Hash the new password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await user.save();

    const payload = {
      userId: user._id,
      email: user.email,
    };
    // Generate a JWT token with expiration time of 10 seconds
    const token = generateToken(payload, '10m', 'email');

    // Send email verification link
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
      subject: 'Email Verification',
      html: `
        <h3>Hello ${username}!</h3>
        <p>Thank you for registering on our website. Please click on the following link to verify your email:</p>
        <a href="${req.headers.origin}/verify-email/${token}">${req.headers.origin}/verify-email/${token}</a>
        <p>If you did not register on our website, please ignore this email.</p>
      `,
    };

    // Send the email
    // ! Comment out the following lines if you don't want to send an email to the user for testing purposes
    // await transporter.sendMail(mailOptions);

    return res.status(201).json({
      success: true,
      msg: 'User registered successfully. Please check your email for verification. The link will expire in 10 minutes.',
      error: null,
      msg_for_testing: `/verify-email/${token}`,
    });
  } catch (err) {
    errorHandler(err, req, res);
  }
};

// Send email verification link again
exports.sendVerificationEmailAgain = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      //400
      return res.status(400).json({
        success: true,
        msg: 'Please provide an email',
        error: null,
      });
    }

    // Find the user by email
    const user = await User.findOne({ email });

    // Check if user exists and is not verified
    if (!user || user.isVerified) {
      // 400
      return res.status(400).json({
        success: false,
        msg: 'User not found or already verified',
        error: null,
      });
    }

    const payload = {
      userId: user._id,
      email: user.email,
    };
    // Generate a new JWT token with expiration time of 10 seconds
    const token = generateToken(payload, '10m', 'email');

    // Send email verification link
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
      subject: 'Email Verification',
      html: `
        <h3>Hello ${user.username}!</h3>
        <p>Thank you for registering on our website. Please click on the following link to verify your email:</p>
        <a href="${req.headers.origin}/verify-email/${token}">${req.headers.origin}/verify-email/${token}</a>
        <p>If you did not register on our website, please ignore this email.</p>`,
    };

    // Send the email
    // ! Comment out the following lines if you don't want to send an email to the user for testing purposes
    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      msg: 'Email verification link sent again. Please check your email for verification. The link will expire in 10 minutes.',
      error: null,
      msg_for_testing: `/verify-email/${token}`,
    });
  } catch (err) {
    errorHandler(err, req, res);
  }
};

// Verify user's email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Verify the JWT token
    const decodedToken = verifyToken(token, 'email');

    console.log(decodedToken);

    // Find the user by userId from the decoded token
    const user = await User.findById(decodedToken.userId);
    if (!user) {
      return res.status(404).json({
        success: true,
        msg: 'User not found',
        error: null,
      });
    }

    // Check if the email is already verified
    if (user.isVerified) {
      return res.status(200).json({
        success: true,
        msg: 'Email already verified',
        error: null,
      });
    }

    // Update user's isVerified status to true
    user.isVerified = true;
    await user.save();

    return res.status(200).json({
      success: true,
      msg: 'Email verified successfully',
      error: null,
    });
  } catch (err) {
    errorHandler(err, req, res, next);
  }
};
