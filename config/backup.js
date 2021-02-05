const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');
const pool = require('../config/db');

// @Desc    Login/Landing page
// @route    GET / 
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login'
    })
})

// @Desc    Dashboard 
// @route    GET /dashboard 
router.get('/dashboard', ensureAuth, async (req, res) => {

        // Get a collection of a users favorite artist_id's 
         async function getArtistIdCollection (user_id) {
            return artist_ids = await pool.query('SELECT artist_id from artistPreferences WHERE user_id = ?', [user_id]);
        }

        // Get the data about a specific artist
        async function getArtistInfo (artist_id) {
            return artistInfo = await pool.query('SELECT artist_name, artist_image, artist_url from artists WHERE artist_id = ?', [artist_id]);
        }

        // Create an structured ArtistObject 
        function getArtistObject (artistInfo) {
            const artist = {};
            const thisArtist = Object.create(artist);
            thisArtist.name = artistInfo['artist_name'];
            thisArtist.image = artistInfo['artist_image'];
            thisArtist.url = artistInfo['artist_url'];
            return thisArtist;
        }

  /*    Async function that maps through a users artistPreferences IDs
        and use helper functions to return an array of artistPreferences DATAs
*/      async function getArtistsArray (user_id) {
            let artistPreferencesArray = [];
            const this_artist_ids = await getArtistIdCollection(user_id);
            const array = await Promise.all(this_artist_ids[0].map(async artist => {
                const this_artist_info = await getArtistInfo(artist.artist_id);
                const this_artist_object = getArtistObject(this_artist_info[0][0]);
                return this_artist_object;
            }));
            return array;
        }

/*      Async function that await artistPreferencesData and then render
        a view to the website
 */     
            function renderView () {
                let artistPreferences = getArtistsArray('1').then(getArtistReturnVal => {
                    res.render('dashboard', {
                        name: req.user.displayName,
                        artistPreferences: getArtistReturnVal
                    });
                });
            }

        /* Invoking main function */
        renderView();
});


module.exports = router;


/*      async function renderView () {
    res.render('dashboard', {
        name: req.user.displayName,
        artistPreferences: await getArtistsArray('1')
    })
} */