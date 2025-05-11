const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const logger = require('../services/logger');

// @route   GET /api/auth/google
// @desc    Authenticate with Google
// @access  Public
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// @route   GET /api/auth/google/callback
// @desc    Google auth callback
// @access  Public
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, generate JWT
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email, name: req.user.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );
    
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    avatar: req.user.avatar,
    role: req.user.role
  });
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', (req, res) => {
  req.logout();
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;