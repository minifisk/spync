const express = require('express');
const passport = require('passport');
const router = express.Router();

// @Desc    Auth with spotify
// @route    GET /auth/spotify
router.get('/spotify', passport.authenticate('spotify', {  scope: ['user-read-email', 'user-read-private', 'user-top-read'] , showDialog: false }));


// @Desc    Spotify auth callback 
// @route    GET /auth/spotify/callback 
router.get(
    '/spotify/callback',
    passport.authenticate('spotify', { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/dashboard');
    }
  );

// @Desc    Logout user
// @route    GET /auth/logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/'); 
})





module.exports = router;