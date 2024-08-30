const express = require('express');
const passport = require('passport');
const router = express.Router();

// Route to initiate Google OAuth
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback route
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/'); // Redirect to home or dashboard
  }
);

// Route to log out the user
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

// Route to get the currently authenticated user
router.get('/user', (req, res) => {
  res.send(req.user);
});

module.exports = router;
