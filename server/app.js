require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const { swaggerSpec, swaggerUi } = require('./config/swagger');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
require('./config/database');

// Passport configuration
require('./config/passport')(passport);
app.use(passport.initialize());

// Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/segments', require('./routes/segments'));
app.use('/api/campaigns', require('./routes/campaigns'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});