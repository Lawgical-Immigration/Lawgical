const express = require('express');
const passport = require('passport');

const router = express.Router();

// Route to start the Google OAuth process
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google callback route after authentication
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect to the dashboard or desired page
    res.redirect('/dashboard');
  }
);

// Route to log out the user
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
      return res.redirect('/'); // Redirect to the home page on error
    }
    res.redirect('/'); // Redirect to the home page after logout
  });
});

module.exports = router;
