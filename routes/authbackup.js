const express = require('express');
const passport = require('passport');
const router = express.Router();

// @Desc    Auth with spotify
// @route    GET /auth/spotify
router.get('/spotify', passport.authenticate('spotify', {  scope: ['user-read-email', 'user-read-private', 'user-top-read'] , showDialog: true }));


// Async function for returning a promise while authenticating
 const promisifiedPassportAuthentication = (req, res) =>
  new Promise((resolve, reject) => {
    passport.authenticate(
      ['spotify'],
      { failureRedirect: '/login' },
      (err, user) => {
        if (err) reject(new Error(err))
        else if (!user) reject(new Error('Not authenticated'))
        resolve(user)
      })(req, res)
    })


// @Desc    Spotify auth callback 
// @route    GET /auth/spotify/callback 
router.get(
    '/spotify/callback',
    async (req, res) => {

      // Await authentication promise to resolve
      await promisifiedPassportAuthentication();
      
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