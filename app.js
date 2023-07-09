const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const config = require('./config/config');
const mongoose = require('./config/db'); // Require the db.js file for database connection
const helmet = require('helmet');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        'script-src': ["'self'"],
        'object-src': ["'none'"],
        'img-src': ["'self'"],
        'frame-ancestors': ["'none'"],
        'base-uri': ["'self'"],
        'font-src': ["'self'"],
        'style-src': ["'self'"],
        'manifest-src': ["'self'"],
      },
    },
    dnsPrefetchControl: { allow: false },
    expectCt: { enforce: true, maxAge: 30 },
    frameguard: { action: 'deny' },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    permittedCrossDomainPolicies: { permittedPolicies: 'none' },
    referrerPolicy: { policy: 'no-referrer' },
  })
);
// Add the error handling middleware
app.use(errorHandler);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const whitelist = ['http://localhost:5173' /** other domains if any */];
if (whitelist.length > 0) {
  const corsOptions = {
    credentials: true,
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  };
  app.use(cors(corsOptions));
} else {
  app.use(cors());
}

app.use(morgan('dev'));

app.use('/api/auth', authRoutes);

const port = config.port;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
