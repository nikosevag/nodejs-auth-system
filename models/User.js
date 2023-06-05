const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true, // Trim whitespace from beginning and end of username
      lowercase: true, // Convert username to lowercase
      minlength: [3, 'Username must be at least 3 characters long'],
      maxlength: [20, 'Username cannot be longer than 20 characters'],
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9_]+$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid username. Only alphanumeric characters and underscores are allowed.`,
      },
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      validate: {
        validator: (value) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value),
        message: 'Invalid email address',
      },
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    messages: {
      required: '{PATH} is required',
      unique: '{PATH} already exists',
    },
  }
);

userSchema.pre('save', async function (next) {
  try {
    next();
  } catch (err) {
    errorHandler(err, req, res, next);
  }
});

module.exports = mongoose.model('User', userSchema);
